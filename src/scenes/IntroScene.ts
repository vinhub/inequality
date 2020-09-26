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
            'Wealth inequality has been in the news a lot lately. Here is a very simple way to see how wealth inequality emerges in a society and what factors contribute to it.',
            '',
            '',
            'The purpose of this exercise is purely to educate people about this important topic so they can make informed decisions about how to deal with it.',
            '',
            '',
            'Let us start with a very simple game:',
            '',
            '1. Assume that you have two people with exactly one dollar each.',
            '2. They toss a coin, and the loser of the toss gives their one dollar to the winner.',
            '3. That\'s it. As simple as that! (Don\'t worry, it\'ll get very interesting in a minute.)',
            '',
            'Want to play it?'
        ]

        let introTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, introText, Constants.bodyTextStyle).setWordWrapWidth(utils.rightX - utils.leftX, true)

        curY += introTextObj.height + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + (utils.rightX - utils.leftX) / 2, curY, 'Next >>>',
            () => { this.scene.start('SimpleGameScene') }, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}
