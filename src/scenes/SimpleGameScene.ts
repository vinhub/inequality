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

    constructor()
    {
        super('SimpleGameScene')
        this.utils = {} as any
        this.descText = {} as any
        this.timeline = {} as any
        this.actionButton = {} as any
    }

    preload()
    {
        this.load.image('normal-face', 'assets/normal-face.png')
        this.load.image('happy-face', 'assets/happy-face.png')
        this.load.image('unhappy-face', 'assets/unhappy-face.png')
        this.load.image('heads', 'assets/heads.jpg')
        this.load.image('tails', 'assets/tails.jpg')
        this.load.image('dollar-note', 'assets/dollar-note.png')
    }

    create()
    {
        this.utils = new Utils(this)

        let curY = this.utils.topY

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, 'Coin Toss Game')
        curY += header.height()

        this.descText = this.add.text(this.utils.leftX, curY, 'We have two players, A and B, each with $1. Press the "Toss the coin" button.', Constants.bodyTextStyle)

        curY += this.descText.height + 30

        const gameHeight = 300

        this.createGame(this.utils.leftX, curY, this.utils.rightX - this.utils.leftX, gameHeight)

        curY += gameHeight

        this.actionButton = this.add.existing(new TextButton(this, this.utils.leftX + (this.utils.rightX - this.utils.leftX) / 2, curY, 'Toss the coin',
            () => { this.timeline.play() }, true).setOrigin(0.5, 0)) as TextButton

        curY += this.actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createGame(leftX: number, topY: number, width: number, height: number)
    {
        let graphics: Phaser.GameObjects.Graphics = this.add.graphics()

        // create persons
        const person1Name: string = 'A'
        const person2Name: string = 'B'
        let person1: Person = new Person(person1Name, Constants.startingWealth)
        let person2: Person = new Person(person2Name, Constants.startingWealth)

        person1.add(this, leftX + 100, topY + 60, 'Hi! I\'m ' + person1Name + '.')

        person2.add(this, leftX + width - 100, topY + 60, 'Hello! I\'m ' + person2Name + '.')

        // draw coin
        let coin: Phaser.GameObjects.Image = this.add.image(leftX + width / 2, topY + 50, 'heads').setOrigin(0.5, 0.5)

        // create line that will be used to connect the two people
        //let line: Phaser.GameObjects.Line = this.add.line(person1.personImage.x, person1.personImage.y, person1.personImage.x, person1.personImage.y, person2.personImage.x, person2.personImage.y, 0x00ff00)
        let line: Phaser.Curves.Line = new Phaser.Curves.Line(new Phaser.Math.Vector2(person1.personImage.getBottomRight().x, person1.personImage.getBottomRight().y),
            new Phaser.Math.Vector2(person2.personImage.getBottomLeft().x, person2.personImage.getBottomLeft().y))
        graphics.lineStyle(1, Constants.blueColor)

        line.draw(graphics)

        // set up all the animations in the game
        this.timeline = this.tweens.createTimeline()

        // coin flip animation
        this.utils.flashText(this.timeline, this.descText, 'A chooses Heads, B chooses Tails.')
        this.utils.flashText(this.timeline, person1.messageText, 'Heads!')
        this.utils.flashText(this.timeline, person2.messageText, 'Tails!')

        const numFlips: number = Math.round(Math.random()) + 5 // 5 or 6 flips randomly
        this.timeline.add(
        {
            targets: coin,
            scaleX: { from: 1, to: 0.05 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: numFlips,
            yoyo: true,
            onYoyo: () => { coin.setTexture((coin.texture.key == 'heads') ? 'tails' : 'heads') },
            completeDelay: 300
        })

        // show toss result
        const itsHeads: boolean = ((numFlips % 2) == 1)
        const winner: Person = itsHeads ? person1 : person2
        const loser: Person = itsHeads ? person2 : person1
        this.utils.flashText(this.timeline, this.descText,
            `It\'s ${itsHeads ? 'Heads' : 'Tails'}! ${winner.name} wins, ${loser.name} loses. So $1 is transferred from ${loser.name} to ${winner.name}.`)
        this.utils.flashText(this.timeline, winner.messageText, 'I win!')
        this.utils.flashText(this.timeline, loser.messageText, 'I lose!')

        // move dollar note from loser to winner
        let dollarNote: Phaser.GameObjects.Image = new Phaser.GameObjects.Image(this, loser.personImage.getBottomCenter().x, loser.personImage.getBottomCenter().y, 'dollar-note').setTintFill(Constants.greenColor)
        this.timeline.add(
        {
            targets: dollarNote,
            x: { from: loser.personImage.getBottomCenter().x, to: winner.personImage.getBottomCenter().x },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            delay: 300,
            duration: 1000,
            repeat: 0,
            yoyo: false,
            onStart: () => { this.add.existing(dollarNote) },
            completeDelay: 1000,
            onComplete: () =>
            {
                dollarNote.destroy()
            }
        })

        // update wealth
        winner.incrementWealth(this.utils, this.timeline, 1)
        loser.incrementWealth(this.utils, this.timeline, -1)
        this.utils.flashText(this.timeline, this.descText, `Now ${winner.name} has $2 and ${loser.name} has nothing.`)
        this.utils.flashText(this.timeline, winner.messageText, 'I\'m rich!')
        this.utils.flashText(this.timeline, loser.messageText, 'I\'m poor!',
            () => { this.actionButton.setCallback('Got it? Now let\'s play a more interesting game >>>', () => { this.scene.start('InequalityGameScene') }) })
    }
}
