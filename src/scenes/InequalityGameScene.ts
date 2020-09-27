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
    descTextObj: Phaser.GameObjects.Text
    persons: Person[] = new Array()
    startingWealth: integer
    wagerAmountMin: integer
    wagerAmountMax: integer
    timeline: Phaser.Tweens.Timeline
    utils: Utils
    graphics: Phaser.GameObjects.Graphics
    connectingCurve: Phaser.Curves.CubicBezier
    actionButton: TextButton
    gameCircleCenter: Phaser.Geom.Point
    chart: Chart
    chartDesc: Phaser.GameObjects.Text
    cRoundsCompleted: number // number of rounds we have played

    constructor()
	{
        super('InequalityGameScene')

        this.startingWealth = 1 // we start with this amount per person
        this.wagerAmountMin = this.wagerAmountMax = 1 // loser of the toss sends this amount to winner
        this.cRoundsCompleted = 0

        this.descTextObj = {} as any
        this.timeline = {} as any
        this.utils = {} as any
        this.graphics = {} as any
        this.connectingCurve = {} as any
        this.actionButton = {} as any
        this.gameCircleCenter = {} as any
        this.chart = {} as any
        this.chartDesc = {} as any
    }

	preload()
    {
        this.load.script('chartjs', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js');

        this.load.image('normal-face-small', 'assets/normal-face-small.png')
        this.load.image('happy-face-small', 'assets/happy-face-small.png')
        this.load.image('unhappy-face-small', 'assets/unhappy-face-small.png')
        this.load.image('heads', 'assets/heads.png')
        this.load.image('tails', 'assets/tails.png')
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        this.graphics = this.add.graphics()

        this.utils = new Utils(this)
        let curY = this.utils.topY;

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, 'Wealth Inequality Game')
        curY += header.height()

        const descText = `Here we have ${Constants.numPersons} players, each with $${this.startingWealth}. We will ask them to pair up and play the same Coin Toss game.
             You can see the wealth distribution chart on the right. Press the "Start" button to play the first round.`

        this.descTextObj = this.add.text(this.utils.leftX, curY, descText, Constants.bodyTextStyle).setWordWrapWidth(this.utils.rightX - this.utils.leftX, true)

        curY += this.descTextObj.height + 20

        const gameWidth = 500
        const gameHeight = 500

        this.createGame(this.utils.leftX + 20, curY, gameWidth, gameHeight)
        this.createChart(this.utils.leftX + 20 + gameWidth, curY, this.utils.rightX - this.utils.leftX - gameWidth - 20, gameHeight)
        this.updateChart()

        curY += gameHeight

        this.actionButton = this.add.existing(new TextButton(this, this.utils.leftX + gameWidth + 50, curY, 'Start',
            () => { this.timeline.play() }, true).setOrigin(0, 0)) as TextButton

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createGame(leftX: number, topY: number, width: number, height: number)
    {
        // create persons
        for (let iPerson: integer = 0; iPerson < Constants.numPersons; iPerson++)
        {
            this.persons[iPerson] = new Person(this.startingWealth, true)
        }

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

            person.add(this, position.x, position.y, '')
        }

        this.setupTimeline(true)
    }

    setupTimeline(firstRound: boolean)
    {
        this.timeline = this.tweens.createTimeline()
        const tempObj = { val: 0 }

        // for subsequent rounds we need to speed up
        if (!firstRound)
            this.timeline.timeScale = 10

        // for debugging purposes
        this.timeline.timeScale = 10

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

            // select wager amount: random amount between minimum and maximum wager amounts, but can't wager more than what each one of them has
            const wagerAmountMax = Math.min(this.wagerAmountMax, player1.wealth, player2.wealth)
            const wagerAmount: number = this.wagerAmountMin + Math.floor(Math.random() * (wagerAmountMax - this.wagerAmountMin))

            // set up coin toss, determine winner, transfer money from loser to winner
            const toss: boolean = (Math.random() > 0.5)
            const winner: Person = toss ? player1 : player2
            const loser: Person = toss ? player2 : player1

            this.utils.flashText(this.timeline, winner.messageText, 'I win!')
            this.utils.flashText(this.timeline, loser.messageText, 'I lose!')

            // move wager amount from loser to winner
            this.moveMoney(loser, winner, wagerAmount, this.gameCircleCenter)

            winner.incrementWealth(this.utils, this.timeline, wagerAmount)
            loser.incrementWealth(this.utils, this.timeline, -wagerAmount)

            // unselect them
            player1.setSelected(this.timeline, false)
            player2.setSelected(this.timeline, false)

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
                    // update chart
                    this.updateChart()

                    this.graphics.clear()

                    for (let iPerson: number = 0; iPerson < this.persons.length; iPerson++)
                    {
                        this.persons[iPerson].updateStateMessage()
                    }

                    if (firstRound && (iPair == 0)) // speed up animation after the first one
                        this.timeline.timeScale = 10
                }
            })
        }

        // set up next round
        this.timeline.add(
        {
            targets: tempObj,
            val: { from: 0, to: 1 },
            duration: 0,
            repeat: 0,
            yoyo: false,
            onStart: () =>
            {
                // update chart
                this.updateChart()

                // update description
                if (this.startingWealth == 1)
                {
                    switch (this.cRoundsCompleted)
                    {
                        case 0:
                            this.descTextObj.setText(`At the end of the first round, we have half the players with $${2 * this.startingWealth} and half the players with nothing.
                                Press the "Next Round" button to play the another round.`)
                            this.actionButton.setCallback('Next Round', () => { this.setupTimeline(false); this.timeline.play() })
                            break

                        default:
                            if (this.isConverging())
                            {
                                this.descTextObj.setText(`As you can see, even with random chance, wealth starts to concentrate in a small number of hands and
                                    most people end up with nothing. Now let us move on to an even more interesting game.`)

                                this.actionButton.setCallback('More Interesting Game', () =>
                                {
                                    this.reinitGameParams(5, 1, 3)
                                })
                            }
                            else
                            {
                                this.descTextObj.setText(`With each subsequent round, smaller and smaller number of players accumulate most of the wealth
                                    and more and more people end up with nothing. Press the "Next Round" button to play another round.`)

                                this.actionButton.setCallback('Next Round', () =>
                                {
                                    this.setupTimeline(false); this.timeline.play()
                                })
                            }
                            break
                    }
                }
                else
                {
                    if (this.isConverging())
                    {
                        this.descTextObj.setText(`Even with a larger starting amount and more randomness in the wager amounts, we still get the same result.
                            Press the "Conclusion >>>" button to see the conclusion.`)

                        this.actionButton.setCallback('Conclusion >>>', () => { this.utils.sceneTransition(this, 'ConclusionScene') })
                    }
                else
                    {
                        this.descTextObj.setText(`Initially you may see more of a normal distribution of wealth, but soon it starts to get lopsided. People start to go broke one by one, and 
                            a smaller and smaller number of people end up with more and more of the wealth. Press the "Next Round" button to play another round.`)

                        this.actionButton.setCallback('Next Round', () =>
                        {
                            this.setupTimeline(false); this.timeline.play() 
                        })
                    }
                }

                this.cRoundsCompleted++
            }
        })
    }

    reinitGameParams(startingWealth: number, wagerAmountMin: number, wagerAmountMax: number)
    {
        this.startingWealth = startingWealth
        this.wagerAmountMin = wagerAmountMin
        this.wagerAmountMax = wagerAmountMax

        // update persons
        for (let iPerson: number = 0; iPerson < this.persons.length; iPerson++)
        {
            this.persons[iPerson].setWealth(startingWealth)
            this.persons[iPerson].messageText.text = ''
        }

        this.cRoundsCompleted = 0

        this.updateChart()

        this.descTextObj.setText(`Now we will start each person with $${startingWealth}. And at each coin toss, we will let them wager between $${wagerAmountMin} and $${wagerAmountMax} at random. 
            Let us see if this changes the results. Press the "Start" button to start.`)

        this.setupTimeline(true); 

        this.actionButton.setCallback('Start', () =>
        {
            this.timeline.play()
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

    moveMoney(loser: Person, winner: Person, wagerAmount: number, center: Phaser.Geom.Point)
    {
        let wagerAmountText: Phaser.GameObjects.Text
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
                wagerAmountText = new Phaser.GameObjects.Text(this, startPoint.x, startPoint.y, `$${wagerAmount}`, Constants.bodyTextStyle).setTintFill(Constants.greenColor)
                this.add.existing(wagerAmountText)
            },
            onUpdate: (tween: Phaser.Tweens.Tween, target: any) =>
            {
                const position = curve.getPoint(target.val);
                wagerAmountText.x = position.x;
                wagerAmountText.y = position.y;
            },
            onComplete: () => { wagerAmountText.destroy() }
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

    createChart(leftX: number, topY: number, width: number, height: number)
    {
        //Chart.default.global.hover.mode = 'nearest'

        const config = {
            type: 'bar',
            options: {
                title: {
                    display: true,
                    text: 'Wealth Distribution Chart'
                },
                scales: {
                    yAxes: [{
                        ticks: { beginAtZero: true, stepsize: 1, precision: 0, suggestedMax: this.persons.length }
                    }]
                },
                layout: {
                    padding: { left: 0, right: 0 }
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

        this.chart = new Chart(this, leftX + width / 2, topY + height / 2, width, 2 * height / 3, config)
        this.add.existing(this.chart)

        this.chart.chart.data.datasets[0].label = '(x: amount, y: number of people)'
        this.chart.chart.data.datasets[0].borderWidth = 1

        this.chartDesc = new Phaser.GameObjects.Text(this, leftX + 40, topY + 5 * height / 6, this.describeChart(), Constants.smallTextStyle)
        this.add.existing(this.chartDesc)
    }

    updateChart()
    {
        for (let amount: number = 0; amount < this.persons.length * this.startingWealth + 1; amount++)
        {
            const numPersons: integer = this.persons.filter((person: Person) => { return person.wealth == amount }).length

            this.chart.chart.data.labels[amount] = `$${ amount }`
            this.chart.chart.data.datasets[0].data[amount] = numPersons

            this.chart.chart.data.datasets[0].backgroundColor[amount] = 'rgba(54, 162, 235, 0.2)'
            this.chart.chart.data.datasets[0].borderColor[amount] = 'rgba(54, 162, 235, 1)'
        }

        this.chart.updateChart()

        this.chartDesc.setText(this.describeChart())
    }

    describeChart(): string
    {
        const cBroke = this.persons.filter((person: Person) => { return person.wealth == 0 }).length
        const maxWealth = this.persons.sort((p1: Person, p2: Person) => { return p1.wealth - p2.wealth })[this.persons.length - 1].wealth
        const desc: string = `No. of broke people: ${cBroke}, Max. wealth: $${ maxWealth }`

        return desc
    }

    isConverging(): boolean
    {
        if (this.cRoundsCompleted <= 3)
            return false

        const numBroke: integer = this.persons.filter((person: Person) => { return person.wealth == 0 }).length
        return numBroke >= 5 * this.persons.length / 8 
    }
}
