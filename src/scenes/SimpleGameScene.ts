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
    timeline1: Phaser.Tweens.Timeline
    timeline2: Phaser.Tweens.Timeline
    timeline3: Phaser.Tweens.Timeline
    timeline4: Phaser.Tweens.Timeline
    timeline5: Phaser.Tweens.Timeline
    actionButton: TextButton

    constructor()
    {
        super('SimpleGameScene')
        this.utils = {} as any
        this.descText = {} as any
        this.timeline1 = this.timeline2 = this.timeline3 = this.timeline4 = this.timeline5 = {} as any
        this.actionButton = {} as any
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

        this.createGame(this.utils.leftX, curY, this.utils.rightX - this.utils.leftX, gameHeight)

        curY += gameHeight

        this.actionButton = this.add.existing(new TextButton(this, this.utils.leftX + (this.utils.rightX - this.utils.leftX) / 2, curY, 'Play',
            () => { this.timeline1.play() }, true).setOrigin(0.5, 0)) as TextButton

        curY += this.actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, this.utils.leftX, curY, this.utils.rightX, this.utils.bottomY)
    }

    createGame(leftX: number, topY: number, width: number, height: number)
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
        this.timeline1 = this.tweens.createTimeline();

        this.utils.flashText(this.timeline1, this.descText, 'We have two players, A and B, each with $1.')
        this.utils.flashText(this.timeline1, person1.wealthText)
        this.utils.flashText(this.timeline1, person2.wealthText, undefined, () => { this.actionButton.text = 'Next Step'; this.actionButton.callback = () => { this.timeline2.play() } })

        // coin flip animation
        this.timeline2 = this.tweens.createTimeline();
        this.utils.flashText(this.timeline2, this.descText, 'They toss a coin. A chooses Heads, B chooses Tails.')
        this.utils.flashText(this.timeline2, person1.messageText, 'Heads!')
        this.utils.flashText(this.timeline2, person2.messageText, 'Tails!')

        const numFlips: number = Math.round(Math.random()) + 9; // 9 or 10 flips randomly
        this.timeline2.add(
        {
            targets: coin,
            scaleX: { from: 1, to: 0.05 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: numFlips,
            yoyo: true,
            onYoyo: () => { coin.setTexture((coin.texture.key == 'heads') ? 'tails' : 'heads') },
            onComplete: () => { this.actionButton.callback = () => { this.timeline3.play() } }
        })

        // show toss result
        this.timeline3 = this.tweens.createTimeline();
        const itsHeads: boolean = ((numFlips % 2) == 1)
        const winner: Person = itsHeads ? person1 : person2
        const loser: Person = itsHeads ? person2 : person1
        this.utils.flashText(this.timeline3, this.descText,
            `It\'s ${itsHeads ? 'Heads' : 'Tails'}! ${winner.name} wins, ${loser.name} loses. So $1 is transferred from ${loser.name} to ${winner.name}.`)
        this.utils.flashText(this.timeline3, winner.messageText, 'I win!')
        this.utils.flashText(this.timeline3, loser.messageText, 'I lose!', () => { this.actionButton.callback = () => { this.timeline4.play() } })

        // move dollar note from loser to winner
        this.timeline4 = this.tweens.createTimeline();
        let dollarNote: Phaser.GameObjects.Image = new Phaser.GameObjects.Image(this, loser.personImage.x, loser.personImage.y, 'dollar-note')
        this.timeline4.add(
        {
            targets: dollarNote,
            x: { from: loser.personImage.x, to: winner.personImage.x },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,
            yoyo: false,
            onStart: () => { this.add.existing(dollarNote) },
            completeDelay: 1000,
            onComplete: () =>
            {
                dollarNote.destroy();
                winner.incrementWealth(this.utils, this.timeline5, 1)
                loser.incrementWealth(this.utils, this.timeline5, -1)
                this.actionButton.callback = () => { this.timeline5.play() }
            }
        })

        // update wealth
        this.timeline5 = this.tweens.createTimeline();
        this.utils.flashText(this.timeline5, this.descText, `Now ${winner.name} has $2 and ${loser.name} has nothing.`)
        this.utils.flashText(this.timeline5, winner.messageText, 'I\'m rich!')
        this.utils.flashText(this.timeline5, loser.messageText, 'I\'m poor!',
            () => { this.actionButton.text = 'Got it? Now let\'s play a more interesting game >>>'; this.actionButton.callback = () => { this.scene.start('InequalityGameScene') } })
    }
}
