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
    persons: Person[]
    startingWealth: integer
    wagerAmountMin: integer
    wagerAmountMax: integer
    timeline: Phaser.Tweens.Timeline
    utils: Utils
    graphics: Phaser.GameObjects.Graphics
    connectingCurve: Phaser.Curves.CubicBezier
    actionButton1: TextButton
    actionButton2: TextButton
    gameCircleCenter: Phaser.Geom.Point
    chart: Chart
    chartDesc: Phaser.GameObjects.Text

    gameLevel: number
    cRoundsCompleted: number // number of rounds we have played
    scaleFactor: number

    constructor()
	{
        super('InequalityGameScene')

        this.gameLevel = 1
        this.startingWealth = 1 // we start with this amount per person
        this.wagerAmountMin = this.wagerAmountMax = 1 // loser of the toss sends this amount to winner
        this.cRoundsCompleted = 0
        this.scaleFactor = 1

        this.persons = new Array()
        this.descTextObj = {} as any
        this.timeline = {} as any
        this.utils = {} as any
        this.graphics = {} as any
        this.connectingCurve = {} as any
        this.actionButton1 = this.actionButton2 = { } as any
        this.gameCircleCenter = {} as any
        this.chart = {} as any
        this.chartDesc = {} as any
    }

    init(data?: any)
    {
        // set up level params
        if (!data || !data.gameLevel || (data.gameLevel == 1))
        {
            this.gameLevel = 1
            this.startingWealth = this.wagerAmountMin = this.wagerAmountMax = 1
        }
        else if (data.gameLevel == 2)
        {
            this.gameLevel = 2
            this.startingWealth = 5
            this.wagerAmountMin = 1
            this.wagerAmountMax = 5
        }

        this.cRoundsCompleted = 0

        if (this.actionButton2.type) // destroy if we had created it earlier
        {
            this.actionButton2.destroy()
            this.actionButton2 = {} as any
        }
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

        let header: SceneHeader = new SceneHeader(this, this.utils.leftX, curY, this.utils.rightX, `Wealth Inequality Game: Level ${this.gameLevel}`)
        curY += header.height()

        const descText = this.gameLevel == 1 ? `Here we have ${Constants.numPersons} players, each with $${this.startingWealth}. We will pair them up and play multiple rounds of the same game. The wealth distribution chart is also provided. Press "Start" to play the first round.` :
            `Now we will start each person with $${this.startingWealth}. And at each coin toss, we will let them wager between $${this.wagerAmountMin} and $${this.wagerAmountMax} at random. Let us see if this changes the results. Press "Start" to play the first round.`

        this.descTextObj = this.add.text(this.utils.leftX, curY, descText, Constants.bodyTextStyle).setWordWrapWidth(this.utils.rightX - this.utils.leftX, false)

        curY += this.descTextObj.height + 20

        let gameWidth = 500
        let gameHeight = 500
        const availableWidth: number = this.utils.width - 40
        const availableHeight: number = this.utils.height - curY - 40

        if (this.utils.portraitMode)
        {
            this.scaleFactor = Math.min(availableWidth / gameWidth, availableHeight / (2 * gameHeight), 1)
            gameWidth *= this.scaleFactor
            gameHeight *= this.scaleFactor

            this.createGame(this.utils.leftX + this.utils.width / 2 - gameWidth / 2, curY, gameWidth, gameHeight, this.scaleFactor)
            curY += gameHeight

            this.createChart(this.utils.leftX, curY, this.utils.width, this.utils.bottomY - curY)
            curY = this.utils.bottomY
        }
        else // landscape mode
        {
            this.scaleFactor = Math.min(availableWidth / (gameWidth * 2), availableHeight / gameHeight, 1)
            gameWidth *= this.scaleFactor
            gameHeight *= this.scaleFactor

            this.createGame(this.utils.leftX + 20, curY, gameWidth, gameHeight, this.scaleFactor)

            this.createChart(this.utils.leftX + 20 + gameWidth + 40, curY, this.utils.rightX - this.utils.leftX - gameWidth - 60, gameHeight)
            curY += gameHeight
        }

        this.updateChart()

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createGame(leftX: number, topY: number, width: number, height: number, scaleFactor: number)
    {
        // create persons
        for (let iPerson: integer = 0; iPerson < Constants.numPersons; iPerson++)
        {
            this.persons[iPerson] = new Person(this.startingWealth, true, (iPerson == 0), scaleFactor)
        }

        // create the circle of persons
        const radius: number = (width - 20) / 2
        this.gameCircleCenter = new Phaser.Geom.Point(leftX + radius + 10, topY + radius) // center of circle
        let point: Phaser.Geom.Point = new Phaser.Geom.Point(leftX + radius + 10, topY)

        // add all the person images
        for (let iPerson: integer = 0; iPerson < this.persons.length; iPerson++)
        {
            let person: Person = this.persons[iPerson]

            // place persons around the circle uniformly
            let position: Phaser.Geom.Point = Phaser.Math.RotateAround(point, this.gameCircleCenter.x, this.gameCircleCenter.y, Phaser.Math.PI2 * iPerson / this.persons.length)

            person.add(this, position.x, position.y)
        }

        this.actionButton1 = this.add.existing(new TextButton(this, leftX + width - 20, topY + height, 'Start',
            () => { this.timeline.play() }, true, true).setScale(this.scaleFactor).setOrigin(0, 0)) as TextButton

        this.actionButton2 = new TextButton(this,
            this.utils.portraitMode ? this.actionButton1.getBottomLeft().x : this.actionButton1.getTopRight().x + 40,
            this.utils.portraitMode ? this.actionButton1.getBottomLeft().y + 10 : this.actionButton1.getTopRight().y,
            'Next Level',
            () => { this.scene.start(this.scene.key, { gameLevel: 2 }) }, true, true).setScale(this.scaleFactor).setOrigin(0, 0)

        this.setupTimeline(true)
    }

    setupTimeline(firstRound: boolean)
    {
        this.timeline = this.tweens.createTimeline()
        const tempObj = { val: 0 }

        // for subsequent rounds we need to speed up
        if (!firstRound)
            this.timeline.timeScale = 10

        // select all players i.e. persons who have at least 1 dollar, and randomize their order. Then we will just pair them up in sequence.
        let players: Person[] = this.persons.filter((person: Person) => { return person.wealth > 0 }).sort(() => Math.random() - 0.5)
        const cPairs: number = Math.floor(players.length / 2)

        // connect the pairs
        this.addConnectingCurves(players, this.gameCircleCenter)

        const messageTexts: Phaser.GameObjects.Text[] = players.map((person: Person) => { return person.messageText })
        const wealthTexts: Phaser.GameObjects.Text[] = players.map((person: Person) => { return person.wealthText })

        // make their coin toss choices (evens: heads, odds: tails)
        const choiceTexts: string[] = players.map((person: Person, index: number) => { return (index % 2 == 0) ? '"Heads!"' : '"Tails!"'})
        this.utils.flashTexts(this.timeline, messageTexts, choiceTexts)

        // select wager amounts: random amount between minimum and maximum wager amounts, but can't wager more than what each one of them has
        const wagerAmounts: number[] = new Array(cPairs) as number[]
        const winners: Person[] = new Array(cPairs) as Person[]
        const losers: Person[] = new Array(cPairs) as Person[]
        const resultTexts: string[] = new Array(players.length) as string[]

        for (let iPair: number = 0; iPair < wagerAmounts.length; iPair++)
        {
            const iPlayer1: number = iPair * 2
            const iPlayer2: number = iPair * 2 + 1
            const player1: Person = players[iPlayer1]
            const player2: Person = players[iPlayer2]

            const wagerAmountMax = Math.min(this.wagerAmountMax, player1.wealth, player2.wealth)
            wagerAmounts[iPair] = this.wagerAmountMin + Math.floor(Math.random() * (wagerAmountMax - this.wagerAmountMin))

            // set up coin toss, determine winner, transfer money from loser to winner
            const toss: boolean = (Math.random() > 0.5)
            const iWinner: number = toss ? iPlayer1 : iPlayer2
            const iLoser: number = toss ? iPlayer2 : iPlayer1

            winners[iPair] = players[iWinner]
            losers[iPair] = players[iLoser]

            resultTexts[iWinner] = '"I win!"'
            resultTexts[iLoser] = '"I lose!"'
        }

        this.utils.flashTexts(this.timeline, messageTexts, resultTexts)

        this.moveWinnings(winners, losers, wagerAmounts, this.gameCircleCenter)

        this.utils.flashTexts(this.timeline, wealthTexts, undefined, () =>
        {
            this.graphics.clear()

            for (let iPlayer: number = 0; iPlayer < players.length; iPlayer++)
            {
                this.persons[iPlayer].updateStateMessage()
            }
        })

        this.utils.flashTexts(this.timeline, messageTexts)

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
                if (this.gameLevel == 1)
                {
                    switch (this.cRoundsCompleted)
                    {
                        case 0:
                            this.descTextObj.setText(`At the end of the first round, we have half the players with $${2 * this.startingWealth} and half the players with nothing. Press "Round ${this.cRoundsCompleted + 2 }" to play another round. (We'll speed up the animation now.) `)
                            this.actionButton1.setCallback(`Round ${this.cRoundsCompleted + 2}`, () => { this.setupTimeline(false); this.timeline.play() })
                            break

                        default:
                            if (this.isConverging())
                            {
                                this.descTextObj.setText(`Notice that even with randomized exchange, wealth concentrates in a few hands and a majority of people end up broke. You can play more rounds or go to the next level.`)

                                this.actionButton1.setCallback(`Round ${this.cRoundsCompleted + 2}`, () => { this.setupTimeline(false); this.timeline.play() })

                                this.actionButton2 = this.add.existing(this.actionButton2) as TextButton
                            }
                            else
                            {
                                this.descTextObj.setText(`With each round, smaller and smaller number of players accumulate most of the wealth and more and more people end up with nothing. Press "Round ${ this.cRoundsCompleted + 2 }" to play another round.`)

                                this.actionButton1.setCallback(`Round ${this.cRoundsCompleted + 2}`, () =>
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
                        this.descTextObj.setText(`Even with a larger starting amount and more randomness in the wager amounts, we still get the same result. You can play more rounds or move on to the conclusion.`)

                        this.actionButton1.setCallback(`Round ${this.cRoundsCompleted + 2}`, () => { this.setupTimeline(false); this.timeline.play() })

                        this.actionButton2.setCallback('Conclusion', () => { this.utils.sceneTransition(this, 'ConclusionScene') })
                        this.add.existing(this.actionButton2) as TextButton
                    }
                else
                    {
                        this.descTextObj.setText(`Initially you may see a normal distribution of wealth, but slowly people go broke one by one, and the same distribution emerges. Play 10 or more rounds before moving to the conclusion.`)

                        this.actionButton1.setCallback(`Round ${this.cRoundsCompleted + 2}`, () =>
                        {
                            this.setupTimeline(false); this.timeline.play() 
                        })
                    }
                }

                this.cRoundsCompleted++
            }
        })
    }

    addConnectingCurves(players: Person[], center: Phaser.Geom.Point)
    {
        const tempObj = { val: 0 }
        this.timeline.add(
        {
            targets: tempObj,
            val: 1,
            duration: 0,
            delay: 0,
            repeat: 0,
            yoyo: false,
            onStart: () =>
            {
                for (let iPair: number = 0; iPair < Math.floor(players.length / 2); iPair++)
                {
                    this.connectingCurve = this.createCurve(players[2 * iPair], players[2 * iPair + 1], center)
                    this.graphics.lineStyle(1, Constants.blueColor, 1)
                    this.connectingCurve.draw(this.graphics)
                }
            }
        })
    }

    moveWinnings(winners: Person[], losers: Person[], wagerAmounts: number[], center: Phaser.Geom.Point)
    {
        let wagerAmountTexts: Phaser.GameObjects.Text[] = new Array(wagerAmounts.length) as Phaser.GameObjects.Text[]
        let curves: Phaser.Curves.CubicBezier[] = new Array(wagerAmounts.length) as Phaser.Curves.CubicBezier[]
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
                for (let iPair: number = 0; iPair < wagerAmounts.length; iPair++)
                {
                    curves[iPair] = this.createCurve(losers[iPair], winners[iPair], center)
                    const startPoint: Phaser.Math.Vector2 = curves[iPair].getStartPoint()
                    const wagerAmountText: Phaser.GameObjects.Text = new Phaser.GameObjects.Text(this, startPoint.x, startPoint.y, `$${wagerAmounts[iPair]}`, Constants.bodyTextStyle).setTintFill(Constants.greenColor)
                    this.add.existing(wagerAmountText)
                    wagerAmountTexts[iPair] = wagerAmountText
                }
            },
            onUpdate: (tween: Phaser.Tweens.Tween, target: any) =>
            {
                for (let iPair: number = 0; iPair < wagerAmounts.length; iPair++)
                {
                    const position = curves[iPair].getPoint(target.val);
                    wagerAmountTexts[iPair].x = position.x;
                    wagerAmountTexts[iPair].y = position.y;
                }
            },
            onComplete: () =>
            {
                wagerAmountTexts.forEach((wagerAmountText) => { wagerAmountText.destroy() })
                winners.forEach((winner: Person, index: number) => { winner.setWealth(winner.wealth + wagerAmounts[index]) })
                losers.forEach((loser: Person, index: number) => { loser.setWealth(loser.wealth - wagerAmounts[index]) })
            }
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

        this.chart = new Chart(this, leftX, topY + 20, width, 2 * height / 3, config).setOrigin(0, 0)
        this.add.existing(this.chart)

        this.chart.chart.data.datasets[0].label = '(x: $, y: # People)'
        this.chart.chart.data.datasets[0].borderWidth = 1

        this.chartDesc = new Phaser.GameObjects.Text(this, this.chart.x + 10, this.chart.y + this.chart.height, this.describeChart(), Constants.smallTextStyle)
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
        const yourWealth = this.persons.find((person: Person) => { return person.isYou })?.wealth
        const desc: string = `# Broke: ${cBroke}.  Richest person: $${maxWealth}.  You: $${yourWealth}.`

        return desc
    }

    isConverging(): boolean
    {
        if (this.cRoundsCompleted <= 3)
            return false

        if (this.cRoundsCompleted >= 9)
            return true

        const numBroke: integer = this.persons.filter((person: Person) => { return person.wealth == 0 }).length
        return numBroke >= 5 * this.persons.length / 8 
    }
}
