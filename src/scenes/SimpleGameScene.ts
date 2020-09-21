import Phaser from 'phaser'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import Person from '../classes/Person';
import TextButton from '../classes/TextButton';

export default class SimpleGameScene extends Phaser.Scene
{
    utils: Utils
    descText: Phaser.GameObjects.Text
    timeline: Phaser.Tweens.Timeline

    constructor()
    {
        super('SimpleGameScene')
        this.utils = {} as any
        this.descText = {} as any
        this.timeline = {} as any
    }

    preload()
    {
        this.load.image('normal-face', 'assets/normal-face.png')
        this.load.image('happy-face', 'assets/happy-face.png')
        this.load.image('unhappy-face', 'assets/unhappy-face.png')
        this.load.image('heads', 'assets/heads.png')
        this.load.image('tails', 'assets/tails.png')
        this.load.image('dollar-note', 'assets/dollar-note.png')
    }

    create()
    {
        this.utils = new Utils(this)

        let curY = this.utils.topY;

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, 'Coin Toss Game')
        curY += header.height()

        this.descText = this.add.text(this.utils.leftX, curY, 'Click "Play" to get started.', Constants.bodyTextStyle)

        curY += this.descText.height + 30

        const gameHeight = 300

        this.createSimpleGame(this.utils.leftX, curY, this.utils.rightX - this.utils.leftX, gameHeight)

        curY += gameHeight

        let actionButton: TextButton = this.add.existing(new TextButton(this, this.utils.leftX + (this.utils.rightX - this.utils.leftX) / 2, curY, 'Play',
            () => { this.playSimpleGame() }, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createSimpleGame(leftX: number, topY: number, width: number, height: number)
    {
        // create persons
        const person1Name: string = 'A'
        const person2Name: string = 'B'
        let person1: Person = new Person(person1Name, Constants.startingWealth)
        let person2: Person = new Person(person2Name, Constants.startingWealth)

        person1.add(this, leftX + 100, topY + 60, 'Hi! I\'m ' + person1Name + '.')

        person2.add(this, leftX + width - 100, topY + 60, 'Hello! I\'m ' + person2Name + '.')

        // draw coin
        let coin: Phaser.GameObjects.Image = this.add.image(leftX + width / 2, topY + 50, 'heads').setOrigin(0.5, 0.5)

        // set up all the animations in the game
        this.timeline = this.tweens.createTimeline();

        this.utils.setText(this.timeline, this.descText, 'We have two players, A and B, each with $1.')
        this.utils.flashText(this.timeline, person1.wealthText)
        this.utils.flashText(this.timeline, person2.wealthText)

        // coin flip animation
        this.utils.setText(this.timeline, this.descText, 'They toss a coin. A chooses Heads, B chooses Tails.')
        this.utils.setText(this.timeline, person1.messageText, 'Heads!')
        this.utils.setText(this.timeline, person2.messageText, 'Tails!')

        const numFlips: number = Math.round(Math.random()) + 9; // 9 or 10 flips randomly
        this.timeline.add(
        {
            targets: coin,
            scaleX: { from: 1, to: 0.05 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: numFlips,
            yoyo: true,
            onYoyo: () => { coin.setTexture((coin.texture.key == 'heads') ? 'tails' : 'heads') }
        })

        // show toss result
        const itsHeads: boolean = ((numFlips % 2) == 1)
        const winner: Person = itsHeads ? person1 : person2
        const loser: Person = itsHeads ? person2 : person1
        this.utils.setText(this.timeline, this.descText,
            `It\'s ${itsHeads ? 'Heads' : 'Tails'}! ${winner.name} wins, ${loser.name} loses. So $1 is transferred from ${loser.name} to ${winner.name}.`)
        this.utils.setText(this.timeline, winner.messageText, 'I win!')
        this.utils.setText(this.timeline, loser.messageText, 'I lose!')

        // move dollar note from loser to winner
        let dollarNote: Phaser.GameObjects.Image = new Phaser.GameObjects.Image(this, loser.personImage.x, loser.personImage.y, 'dollar-note')
        this.timeline.add(
        {
            targets: dollarNote,
            x: { from: loser.personImage.x, to: winner.personImage.x },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,
            yoyo: false,
            onStart: () => { this.add.existing(dollarNote) },
            completeDelay: 1000,
            onComplete: () => { dollarNote.destroy() }
        })

        // update wealth
        this.utils.setText(this.timeline, this.descText, `Now ${winner.name} has $2 and ${loser.name} has nothing.`)
        winner.incrementWealth(this.utils, this.timeline, 1)
        loser.incrementWealth(this.utils, this.timeline, -1)
        this.utils.setText(this.timeline, winner.messageText, 'I\'m rich!')
        this.utils.setText(this.timeline, loser.messageText, 'I\'m poor!')
    }

    playSimpleGame()
    {
        // play animations
        this.timeline.play()
        this.timeline.resetTweens(true)
    }

}
