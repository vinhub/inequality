import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import Person from '../classes/person';

export default class SimpleGameScene extends Phaser.Scene
{
    constructor()
    {
        super('SimpleGameScene')
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
        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, 'Evolution of Wealth Inequality')
        curY += header.height()

        const descText = 'Let\'s say we have 2 people: A and B.'

        let descTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, descText, Constants.bodyTextStyle)

        curY += descTextObj.height + 30

        const gameHeight = 300

        this.createSimpleGame(utils.leftX, curY, utils.width, gameHeight)

        curY += gameHeight

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX,
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
    }

    playSimpleGame()
    {
        // show heads / tails choice

        // coin flip animation

        // show toss result

        // move dollar note from loser to winner

        // update wealth
    }
}
