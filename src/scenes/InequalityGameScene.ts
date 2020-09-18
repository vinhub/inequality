import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import Utils from '../classes/Utils'
import Person from '../classes/person'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';

export default class InequalityGameScene extends Phaser.Scene
{
    persons: Person[] = new Array()

    constructor()
	{
        super('InequalityGameScene')

        for (let iPerson: integer = 0; iPerson < Constants.numPersons; iPerson++)
        {
            this.persons[iPerson] = new Person()
        }
	}

	preload()
    {
        this.load.image('normal-face', 'assets/normal-face.png')
        this.load.image('smiley-face', 'assets/smiley-face.png')
        this.load.image('unhappy-face', 'assets/unhappy-face.png')
        this.load.image('dollar-note', 'assets/dollar-note.png')
    }

    create()
    {
        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'A More Interesting Game')
        curY += header.height()

        const descText = 'Click the "Play Game" button to get started.'

        let descTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, descText, Constants.bodyTextStyle)

        curY += descTextObj.height + 20

        const gameHeight = 680

        this.createGame(utils.leftX + 60, curY, utils.width, gameHeight)

        curY += gameHeight

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX,
            () => { this.scene.start('SimpleGameScene') }, () => { this.playGame() }, null)
    }

    createGame(leftX: number, topY: number, width: number, height: number)
    {
        // create the circle of persons
        const radius: number = 280
        let center: Phaser.Geom.Point = new Phaser.Geom.Point(leftX + radius, topY + radius) // center of circle
        let point: Phaser.Geom.Point = new Phaser.Geom.Point(leftX + radius, topY)

        // add all the person images
        for (let iPerson: integer = 0; iPerson < this.persons.length; iPerson++)
        {
            let person: Person = this.persons[iPerson]

            // place persons around the circle uniformly
            let position: Phaser.Geom.Point = Phaser.Math.RotateAround(point, center.x, center.y, Phaser.Math.PI2 * iPerson / this.persons.length)

            person.add(this, position.x, position.y)
        }
    }

    playGame()
    {

    }
}
