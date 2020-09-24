import Phaser from 'phaser'
import { Chart } from 'phaser3-rex-plugins/templates/ui/ui-components.js'

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
    graphics: Phaser.GameObjects.Graphics
    connectingCurve: Phaser.Curves.CubicBezier
    actionButton: TextButton
    gameCircleCenter: Phaser.Geom.Point
    chart: Chart

    constructor()
	{
        super('InequalityGameScene')

        this.timeline = {} as any
        this.utils = {} as any
        this.graphics = {} as any
        this.connectingCurve = {} as any
        this.actionButton = {} as any
        this.gameCircleCenter = {} as any
        this.chart = {} as any
    }

	preload()
    {
        this.load.script('chartjs', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js');

        this.load.image('normal-face-small', 'assets/normal-face-small.png')
        this.load.image('happy-face-small', 'assets/happy-face-small.png')
        this.load.image('unhappy-face-small', 'assets/unhappy-face-small.png')
        this.load.image('dollar-note-small', 'assets/dollar-note-small.png')
        this.load.image('heads', 'assets/heads.png')
        this.load.image('tails', 'assets/tails.png')
    }

    create()
    {
        for (let iPerson: integer = 0; iPerson < Constants.numPersons; iPerson++)
        {
            this.persons[iPerson] = new Person(undefined, 1, true)
        }

        this.graphics = this.add.graphics()

        this.utils = new Utils(this)
        let curY = this.utils.topY;

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, 'A More Interesting Game')
        curY += header.height()

        const descText = [
            `Here we have ${Constants.numPersons} players. We will ask the players to pair up and play the same Coin Toss game.`,
            'Press the "Start" button to start the first round.'
        ]

        let descTextObj: Phaser.GameObjects.Text = this.add.text(this.utils.leftX, curY, descText, Constants.bodyTextStyle)

        curY += descTextObj.height + 20

        const gameWidth = 500
        const gameHeight = 500

        this.createGame(this.utils.leftX, curY, gameWidth, gameHeight)
        this.createChart(this.utils.leftX + gameWidth, curY, this.utils.rightX - this.utils.leftX - gameWidth, gameHeight)

        curY += gameHeight

        this.actionButton = this.add.existing(new TextButton(this, this.utils.leftX + (this.utils.rightX - this.utils.leftX) / 2 - 20, curY, 'Start',
            () => { this.timeline.play() }, true).setOrigin(0.5, 0.5)) as TextButton

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createGame(leftX: number, topY: number, width: number, height: number)
    {
        // create the circle of persons
        const radius: number = 220
        this.gameCircleCenter = new Phaser.Geom.Point(leftX + radius, topY + radius) // center of circle
        let point: Phaser.Geom.Point = new Phaser.Geom.Point(leftX + radius, topY)

        // add all the person images
        for (let iPerson: integer = 0; iPerson < this.persons.length; iPerson++)
        {
            let person: Person = this.persons[iPerson]

            // place persons around the circle uniformly
            let position: Phaser.Geom.Point = Phaser.Math.RotateAround(point, this.gameCircleCenter.x, this.gameCircleCenter.y, Phaser.Math.PI2 * iPerson / this.persons.length)

            person.add(this, position.x, position.y, 'P' + iPerson)
        }

        this.setupTimeline(true)
    }

    createChart(leftX: number, topY: number, width: number, height: number)
    {
        //Chart.default.global.hover.mode = 'nearest'

        const config = {
            type: 'bar',
            options: {
                scales: {
                    yAxes: [{
                        ticks: { beginAtZero: true, stepsize: 1, precision: 0 }
                    }]
                },
                layout: {
                    padding: { left: 20, right: 20 }
                }
            },
            data: {
                datasets: [
                    {
                        labels: [],
                        data: [],
                        backgroundColor: [],
                        borderColor: []
                    }]
            }
        }

        this.chart = new Chart(this, leftX + width / 2, topY + height / 2, width, height, config)
        this.add.existing(this.chart)

        this.chart.chart.data.datasets[0].label = 'Wealth (in $)'
        this.chart.chart.data.datasets[0].borderWidth = 1

        for (let iPerson: number = 0; iPerson < this.persons.length; iPerson++)
        {
            const person: Person = this.persons[iPerson]

            this.chart.chart.data.labels[iPerson] = `P${iPerson}`
            this.chart.chart.data.datasets[0].data[iPerson] = person.wealth as integer
            this.chart.chart.data.datasets[0].backgroundColor[iPerson] = 'rgba(54, 162, 235, 0.2)'
            this.chart.chart.data.datasets[0].borderColor[iPerson] = 'rgba(54, 162, 235, 1)'
        }

        this.chart.updateChart()
    }

    setupTimeline(firstRound: boolean)
    {
        this.timeline = this.tweens.createTimeline()
        const tempObj = { val: 0 }

        // for subsequent rounds we need to speed up
        if (!firstRound)
            this.timeline.timeScale = 4

        // select all remaining players i.e. persons who have at least 1 dollar, and randomize their order
        let players: Person[] = this.persons.filter((person: Person) => { return person.wealth > 0 }).sort(() => Math.random() - 0.5)
        let numPlayersLeft: number = players.length

        // loop over all remaining pairs
        for (let iPair: number = 0; iPair < Math.floor(numPlayersLeft / 2); iPair++)
        {
            // pop 2 players
            const player1: Person = players.pop() as Person
            const player2: Person = players.pop() as Person

            // select them
            player1.setSelected(this.timeline, true)
            player2.setSelected(this.timeline, true)
            this.addConnectingCurve(player1, player2, this.gameCircleCenter)

            // show heads / tails
            this.utils.flashText(this.timeline, player1.messageText, 'Heads!')
            this.utils.flashText(this.timeline, player2.messageText, 'Tails!')

            // set up coin toss, determine winner, transfer money from loser to winner
            const toss: boolean = (Math.random() > 0.5)
            const winner: Person = toss ? player1 : player2
            const loser: Person = toss ? player2 : player1

            this.utils.flashText(this.timeline, winner.messageText, 'I win!')
            this.utils.flashText(this.timeline, loser.messageText, 'I lose!')

            // move dollar note from loser to winner
            this.moveMoney(loser, winner, this.gameCircleCenter)

            winner.incrementWealth(this.utils, this.timeline, 1)
            loser.incrementWealth(this.utils, this.timeline, -1)

            // unselect them
            player1.setSelected(this.timeline, false)
            player2.setSelected(this.timeline, false)

            // update chart

            // clean up / set up next iteration
            this.timeline.add(
            {
                targets: tempObj,
                val: { from: 0, to: 1 },
                duration: 0,
                repeat: 0,
                yoyo: false,
                onStart: () =>
                {
                    this.graphics.clear()

                    if (firstRound && (iPair == 0)) // speed up animation after the first one
                        this.timeline.timeScale = 4
                }
            })
        }

        this.timeline.add(
        {
            targets: tempObj,
            val: { from: 0, to: 1 },
            duration: 0,
            repeat: 0,
            yoyo: false,
            onStart: () =>
            {
                this.actionButton.setCallback('Next Round', () => { this.setupTimeline(); this.timeline.play() })
            }
        })
    }

    addConnectingCurve(player1: Person, player2: Person, center: Phaser.Geom.Point)
    {
        this.timeline.add(
        {
            targets: player1.personImage,
            scale: { from: 1, to: 1 },
            duration: 0,
            delay: 300,
            repeat: 0,
            yoyo: false,
            onStart: () =>
            {
                this.connectingCurve = this.createCurve(player1, player2, center)
                this.graphics.lineStyle(1, Constants.blueColor, 1)
                this.connectingCurve.draw(this.graphics)
            }
        })
    }

    moveMoney(loser: Person, winner: Person, center: Phaser.Geom.Point)
    {
        let dollarNote: Phaser.GameObjects.Image
        let curve: Phaser.Curves.CubicBezier
        const tempObj = { val: 0 }

        this.timeline.add(
        {
            targets: tempObj,
            val: 1,
            duration: 1000,
            delay: 300,
            repeat: 0,
            yoyo: false,
            onStart: () =>
            {
                curve = this.createCurve(loser, winner, center)
                const startPoint: Phaser.Math.Vector2 = curve.getStartPoint()
                dollarNote = new Phaser.GameObjects.Image(this, startPoint.x, startPoint.y, 'dollar-note-small').setTintFill(Constants.greenColor)
                this.add.existing(dollarNote)
            },
            onUpdate: (tween: Phaser.Tweens.Tween, target: any) =>
            {
                const position = curve.getPoint(target.val);
                dollarNote.x = position.x;
                dollarNote.y = position.y;
            },
            onComplete: () => { dollarNote.destroy() }
        })
    }

    private createCurve(personFrom: Person, personTo: Person, center: Phaser.Geom.Point): Phaser.Curves.CubicBezier 
    {
        let startPoint: Phaser.Math.Vector2 = personFrom.personImage.getCenter()
        let endPoint: Phaser.Math.Vector2 = personTo.personImage.getCenter()

        startPoint.x = startPoint.x + (center.x - startPoint.x) / 10
        startPoint.y = startPoint.y + (center.y - startPoint.y) / 10
        endPoint.x = endPoint.x + (center.x - endPoint.x) / 10
        endPoint.y = endPoint.y + (center.y - endPoint.y) / 10

        // control points are halfway to the center of the circle
        const controlPoint1: Phaser.Math.Vector2 = new Phaser.Math.Vector2(startPoint.x + (center.x - startPoint.x) / 2, startPoint.y + (center.y - startPoint.y) / 2)
        const controlPoint2: Phaser.Math.Vector2 = new Phaser.Math.Vector2(endPoint.x + (center.x - endPoint.x) / 2, endPoint.y + (center.y - endPoint.y) / 2)

        // create the bezier
        const curve: Phaser.Curves.CubicBezier = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint)
        return curve
    }
}
