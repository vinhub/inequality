import Phaser from 'phaser'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import TextButton from '../classes/TextButton';

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
        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Evolution of Wealth Inequality')
        curY += header.height()

        const introText = [
            'Here is one of the simplest games two people can play.',
            '',
            'Assume that you and a friend both have exactly one dollar to start with.',
            'You toss a coin, and the loser of the toss gives their one dollar to the winner.',
            'That\'s it. As simple as that! (Don\'t worry, it\'ll get very interesting in a minute.)',
            '',
            'Want to play it?'
        ]

        let introTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, introText, Constants.bodyTextStyle)

        curY += introTextObj.height

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + (utils.rightX - utils.leftX) / 2, curY, 'Play Game',
            () => { this.scene.start('SimpleGameScene') }, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}
