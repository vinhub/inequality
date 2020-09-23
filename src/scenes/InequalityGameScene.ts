import Phaser from 'phaser'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import Person from '../classes/Person'
import TextButton from '../classes/TextButton'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';

export default class InequalityGameScene extends Phaser.Scene
{
    persons: Person[] = new Array()
    timeline: Phaser.Tweens.Timeline
    utils: Utils

    constructor()
	{
        super('InequalityGameScene')

        for (let iPerson: integer = 0; iPerson < Constants.numPersons; iPerson++)
        {
            this.persons[iPerson] = new Person()
        }

        this.timeline = {} as any
        this.utils = {} as any
    }

	preload()
    {
        this.load.image('normal-face', 'assets/normal-face-small.png')
        this.load.image('happy-face', 'assets/happy-face-small.png')
        this.load.image('unhappy-face', 'assets/unhappy-face-small.png')
        this.load.image('dollar-note', 'assets/dollar-note.png')
        this.load.image('heads', 'assets/heads.png')
        this.load.image('tails', 'assets/tails.png')
    }

    create()
    {
        this.utils = new Utils(this)
        let curY = this.utils.topY;

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, 'A More Interesting Game')
        curY += header.height()

        const descText = [
            `Here we have ${Constants.numPersons} players. Each player will choose someone to play the Coin Toss game.`,
            'Press the "Start" button.'
        ]

        let descTextObj: Phaser.GameObjects.Text = this.add.text(this.utils.leftX, curY, descText, Constants.bodyTextStyle)

        curY += descTextObj.height + 20

        const gameHeight = 400

        this.createGame(this.utils.leftX + 20, curY, this.utils.rightX - this.utils.leftX, gameHeight)

        curY += gameHeight + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, this.utils.leftX + (this.utils.rightX - this.utils.leftX) / 2, curY, 'Start',
            () => { this.timeline.play() }, true).setOrigin(0.5, 0)) as TextButton

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createGame(leftX: number, topY: number, width: number, height: number)
    {
        // create the circle of persons
        const radius: number = 150
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

        this.timeline = this.tweens.createTimeline()

        // select all remaining players i.e. persons who have at least 1 dollar, and randomize their order
        let players: Person[] = this.persons.filter((person: Person) => { return person.wealth > 0 }).sort(() => Math.random() - 0.5)
        let numPlayersLeft: number = players.length

        // loop over all remaining pairs
        for (let iPair: number = 0; iPair < numPlayersLeft / 2; iPair++)
        {
            // pop 2 players
            const player1: Person = players.pop() as Person
            const player2: Person = players.pop() as Person

            // highlight them
            player1.setHighlighted(this.timeline, true)
            player2.setHighlighted(this.timeline, true)

            // set up coin toss, determine winner, transfer money from loser to winner
            const toss: boolean = (Math.random() > 0.5)
            const winner: Person = toss ? player1 : player2
            const loser: Person = toss ? player2 : player1
            winner.incrementWealth(this.utils, this.timeline, 1)
            loser.incrementWealth(this.utils, this.timeline, -1)

            // unhighlight them
            player1.setHighlighted(this.timeline, false)
            player2.setHighlighted(this.timeline, false)

            // update chart
        }

        // set up next play
    }
}
