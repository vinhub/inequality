import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import { TextButton } from '../classes/TextButton';
import Person from '../classes/person';

export default class IntroScene extends Phaser.Scene
{
	constructor()
	{
		super('IntroScene')
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
        let style: Phaser.Types.GameObjects.Text.TextStyle =
        {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '24px',
            color: '#000',
            padding: { x: 0, y: 20 }
        }

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const leftX = this.cameras.main.worldView.x + 100;
        const topY = this.cameras.main.worldView.y + 100;
        const rightX = this.cameras.main.worldView.x + this.cameras.main.width - 100
        let curY = topY;

        const introText = [
            'Here is one of the simplest games two people can play.',
            '',
            'Assume that you and a friend both have exactly one dollar to start with.',
            'You toss a coin, and the loser of the toss gives their one dollar to the winner.',
            'That\'s it. As simple as that! (Don\'t worry, it\'ll get very interesting in a minute.)',
            '',
            'Want to play it?'
        ]

        let introTextObj: Phaser.GameObjects.Text = this.add.text(leftX, curY, introText, style)

        curY += introTextObj.height + 20

        let textButton: TextButton = new TextButton(this, screenCenterX, curY, 'Yes, let\'s play!', () => { this.playSimpleGame() }).setOrigin(0.5, 0.5)
        this.add.existing(textButton)
        curY += textButton.height

        const gameHeight = 300

        this.createSimpleGame(leftX, curY, rightX - leftX, gameHeight)

        curY += gameHeight

        this.add.existing(new TextButton(this, rightX - 100, curY, 'Next >>', () => { this.scene.start('InequalityGameScene') }))
    }

    createSimpleGame(leftX: number, topY: number, width: number, height: number)
    {
        // draw persons
        let person1: Person = new Person(1, Constants.startingWealth)
        let person2: Person = new Person(2, Constants.startingWealth)

        person1.add(this, leftX + 100, topY + 60, 'Hi!')

        person2.add(this, leftX + width - 100, topY + 60, 'Hello!')

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
