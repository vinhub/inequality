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
        //this.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
    }

    create()
    {
        let style: Phaser.Types.GameObjects.Text.TextStyle =
        {
            fontFamily: 'Georgia, Arial, Helvetica, sans-serif',
            fontSize: '24px',
            color: '#000',
        }

        this.add.text(20, 20, 'Here is probably the simplest game you can play.', style)
        this.add.text(20, 50, 'Assume that you have just two players to start with.', style)
        this.add.text(20, 80, 'Also assume that both the people have just one dollar to start with.', style)
        this.add.text(20, 110, 'Then they toss a coin, and the loser of the toss gives their one dollar to the winner.', style)
        this.add.text(20, 140, 'That\'s it. As simple as that!', style)

        let buttonStyle: Phaser.Types.GameObjects.Text.TextStyle =
        {
            fontFamily: 'Georgia, Arial, Helvetica, sans-serif',
            fontSize: '24px',
            color: '#000',
        }

        let nextButton = new TextButton(this, 400, 400, 'Next >>', buttonStyle, () => { this.scene.start('InequalityGameScene') })
        this.add.existing(nextButton);
    }

}
