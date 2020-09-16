import Phaser from 'phaser'
import { TextButton } from '../classes/TextButton';

export default class IntroScene extends Phaser.Scene
{
	constructor()
	{
		super('IntroScene')
	}

	preload()
    {
    }

    create()
    {
        let style: Phaser.Types.GameObjects.Text.TextStyle =
        {
            fontFamily: 'Georgia, Arial, Helvetica, sans-serif',
            fontSize: '24px',
            color: '#000'
        }

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const textX = 100;
        const textY = 100;

        const introText = [
            'Here is probably the simplest game two people can play.',
            'Assume that you and a friend both have exactly one dollar to start with.',
            'You toss a coin, and the loser of the toss gives their one dollar to the winner.',
            'That\'s it. As simple as that!',
            'Want to play it?'
        ]

        this.add.text(textX, textY, introText, style)

        this.add.existing(new TextButton(this, 300, 260, 'Play', () => { this.playSimpleGame() }))

        this.add.existing(new TextButton(this, 600, 400, 'Next >>', () => { this.scene.start('InequalityGameScene') }))
    }

    playSimpleGame()
    {

    }
}
