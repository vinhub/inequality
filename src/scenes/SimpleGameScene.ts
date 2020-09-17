import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import Person from '../classes/person';

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
        this.load.image('smiley-face', 'assets/smiley-face.png')
        this.load.image('unhappy-face', 'assets/unhappy-face.png')
        this.load.image('coin', 'assets/dollar-coin.png')
        this.load.image('dollar-note', 'assets/dollar-note.png')
    }

    create()
    {
        this.utils = new Utils(this)

        let curY = this.utils.topY;

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, 'Coin Toss Game')
        curY += header.height()

        this.descText = this.add.text(this.utils.leftX, curY, 'Click the "Play Game" button to get started.', Constants.bodyTextStyle)

        curY += this.descText.height + 30

        const gameHeight = 300

        this.createSimpleGame(this.utils.leftX, curY, this.utils.width, gameHeight)

        curY += gameHeight

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX,
            () => { this.scene.start('IntroScene') }, () => { this.playSimpleGame() }, () => { this.scene.start('InequalityGameScene') })
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
        let coin: Phaser.GameObjects.Image = this.add.image(leftX + width / 2, topY + 50, 'coin').setOrigin(0.5, 0)

        // set up all the animations in the game
        this.timeline = this.tweens.createTimeline();

        this.utils.setText(this.timeline, this.descText, 'We have two players, A and B, each with $1.')
        this.utils.flashText(this.timeline, person1.wealthText)
        this.utils.flashText(this.timeline, person2.wealthText)

        // coin flip animation

        // show toss result

        // move dollar note from loser to winner

        // update wealth
    }

    playSimpleGame()
    {
        // play animations
        this.timeline.play()
        this.timeline.resetTweens(true)
    }

}
