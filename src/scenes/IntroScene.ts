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
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'The Evolution of Wealth Inequality')
        curY += header.height()

        const introText = [
            'Wealth inequality has been in the news a lot lately. Here is an interactive guide to help you see how wealth inequality emerges in a society and what factors contribute to it.',
            '',
            '(The purpose of this guide is purely to educate people about this important topic so they can make informed decisions about how to deal with it. ' +
            'Also note that this is essentially just the first chapter in this guide. We hope to add more and more nucances to it over time.)',
            '',
            'Let us start with a very simple game:',
            '',
            '1. Assume that you and a friend each have exactly one dollar to start with.',
            '2. You toss a coin, and the loser of the toss gives their one dollar to the winner.',
            '3. That\'s it. As simple as that! (Don\'t worry, it\'ll get very interesting in a minute.)',
            '',
            'Want to play it?'
        ]

        let introTextObj: Phaser.GameObjects.Text = new Phaser.GameObjects.Text(this, utils.leftX, curY, introText, Constants.bodyTextStyle).setWordWrapWidth(utils.rightX - utils.leftX, false)
        this.add.existing(introTextObj)

        curY += introTextObj.height + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + (utils.rightX - utils.leftX) / 2, curY, 'Next',
            () => { utils.sceneTransition(this, 'SimpleGameScene') }, true, true).setOrigin(0.5, 0)) as TextButton

        let footer: SceneFooter = new SceneFooter(this, utils)
    }

    resize(gameSize, baseSize, displaySize, resolution)
    {
        var width = gameSize.width;
        var height = gameSize.height;

        this.cameras.resize(width, height);
    }
}
