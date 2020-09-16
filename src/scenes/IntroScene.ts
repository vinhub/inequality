import Phaser from 'phaser'

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
            color: '#000',
            fontSize: '24px'
        }

        this.add.text(20, 20, 'Here is probably the simplest game you can play.', style)
        this.add.text(20, 50, 'Assume that you have just two players to start with.', style)
        this.add.text(20, 80, 'Also assume that both the people have just one dollar to start with.', style)
        this.add.text(20, 110, 'Then they toss a coin, and the loser of the toss gives their one dollar to the winner.', style)
        this.add.text(20, 140, 'That\'s it. As simple as that!', style)

        this.input.once('pointerup', (pointer) =>
        {
            this.scene.start('InequalityGameScene');
        }, this);

    }

}
