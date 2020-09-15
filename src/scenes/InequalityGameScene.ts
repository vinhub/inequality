import Phaser from 'phaser'

export default class InequalityGameScene extends Phaser.Scene
{
	constructor()
	{
		super('inequality-game')
	}

	preload()
    {
        this.load.image('background', 'assets/deepblue.png')
        this.load.image('smiley-face', 'assets/smiley-face.png')
        this.load.image('unhappy-face', 'assets/unhappy-face.png')
        this.load.image('dollar-note', 'assets/dollar-note.png')
    }

    create()
    {
        this.add.image(400, 300, 'background')
        this.add.image(100, 100, 'smiley-face')
        this.add.image(200, 200, 'unhappy-face')
        this.add.image(300, 300, 'dollar-note')
    }

    update()
    {

    }
}
