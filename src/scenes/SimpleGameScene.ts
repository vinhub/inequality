import Phaser from 'phaser'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader'
import SceneFooter from '../classes/SceneFooter'
import Person from '../classes/Person'
import TextButton from '../classes/TextButton'

export default class SimpleGameScene extends Phaser.Scene
{
    utils: Utils
    descText: Phaser.GameObjects.Text
    timeline: Phaser.Tweens.Timeline
    actionButton: TextButton
    graphics: Phaser.GameObjects.Graphics

    constructor()
    {
        super('SimpleGameScene')
        this.utils = {} as any
        this.descText = {} as any
        this.timeline = {} as any
        this.actionButton = {} as any
        this.graphics = {} as any
    }

    preload()
    {
        this.load.image('normal-face', 'assets/normal-face.png')
        this.load.image('happy-face', 'assets/happy-face.png')
        this.load.image('unhappy-face', 'assets/unhappy-face.png')
        this.load.image('heads', 'assets/heads.jpg')
        this.load.image('tails', 'assets/tails.jpg')
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        this.utils = new Utils(this)

        let curY = this.utils.topY

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, 'Simple Coin Toss Game')
        curY += header.height()

        this.descText = this.add.text(this.utils.leftX, curY,
            `You and a friend, both have $1 each. Each of you will choose "Heads" or "Tails" and then a coin toss will be simulated. It will randomly generate a "Heads" or "Tails" outcome. Press the "Toss the coin" button.`,
            Constants.bodyTextStyle).setWordWrapWidth(this.utils.rightX - this.utils.leftX)

        curY += this.descText.height + 40

        const gameHeight = 240

        this.createGame(this.utils.leftX, curY, this.utils.rightX - this.utils.leftX, gameHeight)

        curY += gameHeight

        this.actionButton = this.add.existing(new TextButton(this, this.utils.leftX + (this.utils.rightX - this.utils.leftX) / 2, curY, 'Toss the coin',
            () => { this.timeline.play() }, true, true).setOrigin(0.5, 0)) as TextButton

        curY += this.actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createGame(leftX: number, topY: number, width: number, height: number)
    {
        this.graphics = this.add.graphics()

        const centerX: number = leftX + width / 2

        // draw coin
        const coin: Phaser.GameObjects.Image = this.add.image(centerX, topY + 40, 'heads').setOrigin(0.5, 0.5)

        // create persons
        const you: Person = new Person(1, false, `You`)
        const friend: Person = new Person(1, false, `Your friend`)

        you.add(this, centerX - 120, topY + 80, 1)
        friend.add(this, centerX + 120, topY + 80, 1)

        // set up all the animations in the game
        this.timeline = this.tweens.createTimeline()

        // show the persons selected and draw a line connecting them
        you.setSelected(this.timeline, true)
        friend.setSelected(this.timeline, true)
        this.addConnectingLine(you, friend)

        // choice
        const youChooseHeads: boolean = (Math.round(Math.random()) == 1)
        const yourChoice: string = youChooseHeads ? 'Heads' : 'Tails'
        const friendsChoice: string = youChooseHeads ? 'Tails' : 'Heads'

        // coin flip animation
        this.utils.flashText(this.timeline, this.descText, `You choose ${yourChoice}, and your friend chooses ${friendsChoice}.`)
        this.utils.flashText(this.timeline, you.messageText, `"${yourChoice}!"`)
        this.utils.flashText(this.timeline, friend.messageText, `"${friendsChoice}!"`)

        const numFlips: number = Math.round(Math.random()) + 5 // 5 or 6 flips randomly
        this.timeline.add(
        {
            targets: coin,
            scaleX: { from: 1, to: 0.05 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 200,
            repeat: numFlips,
            yoyo: true,
            onYoyo: () => { coin.setTexture((coin.texture.key == 'heads') ? 'tails' : 'heads') },
            completeDelay: 300
        })

        // show toss result
        const itsHeads: boolean = ((numFlips % 2) == 1)
        const winner: Person = itsHeads ? (youChooseHeads ? you : friend) : (youChooseHeads ? friend : you)
        const loser: Person = itsHeads ? (youChooseHeads ? friend : you) : (youChooseHeads ? you : friend)
        this.utils.flashText(this.timeline, this.descText,
            `It\'s ${itsHeads ? 'Heads' : 'Tails'}! So the winner is ${winner.name?.toLowerCase()}. So $1 is transferred from ${loser.name?.toLowerCase()} to ${winner.name?.toLowerCase()}.`)
        this.utils.flashText(this.timeline, winner.messageText, '"I win!"')
        this.utils.flashText(this.timeline, loser.messageText, '"I lose!"')

        // move wager amount from loser to winner
        let wagerAmountText: Phaser.GameObjects.Text =
            new Phaser.GameObjects.Text(this, loser.wealthText.getTopCenter().x, loser.wealthText.getTopCenter().y, '$1', Constants.bodyTextStyle).setTintFill(Constants.greenColor)
        this.timeline.add(
        {
            targets: wagerAmountText,
            x: { from: loser.wealthText.getTopCenter().x, to: winner.wealthText.getTopCenter().x },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            delay: 300,
            duration: 1000,
            repeat: 0,
            yoyo: false,
            onStart: () => { this.add.existing(wagerAmountText) },
            completeDelay: 1000,
            onComplete: () =>
            {
                wagerAmountText.destroy()
            }
        })

        // update wealth
        winner.incrementWealth(this.utils, this.timeline, 1)
        loser.incrementWealth(this.utils, this.timeline, -1)

        // unselect them
        you.setSelected(this.timeline, false)
        friend.setSelected(this.timeline, false)

        // update messages
        this.utils.flashText(this.timeline, winner.messageText, `"Doin' well!"`)
        this.utils.flashText(this.timeline, loser.messageText, `"Broke!"`)

        this.utils.flashText(this.timeline, this.descText, `So finally, you have $${winner === you ? 2 : 0} and your friend has $${winner === friend ? 2 : 0}.`,
            () =>
            {
                this.actionButton.setCallback('Got it? Now let\'s make it more interesting',
                    () =>
                    {
                        this.graphics.clear()
                        this.timeline.resetTweens(true)
                        this.utils.sceneTransition(this, 'InequalityIntroScene')
                    })
            })
    }

    addConnectingLine(person1: Person, person2: Person)
    {
        const tempObj = { val: 0 }

        this.timeline.add(
            {
                targets: tempObj,
                val: 1,
                duration: 0,
                delay: 300,
                repeat: 0,
                yoyo: false,
                onStart: () =>
                {
                    // create line that will be used to connect the two people
                    const line: Phaser.Curves.Line = new Phaser.Curves.Line(new Phaser.Math.Vector2(person1.personImage.getBottomRight().x, person1.personImage.getBottomRight().y),
                        new Phaser.Math.Vector2(person2.personImage.getBottomLeft().x, person2.personImage.getBottomLeft().y))

                    this.graphics.lineStyle(1, Constants.blueColor)
                    line.draw(this.graphics)
                }
            })
    }

}
