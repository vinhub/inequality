import Phaser from 'phaser'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import TextButton from '../classes/TextButton';

export default class InequalityIntroScene extends Phaser.Scene
{
	constructor()
	{
		super('InequalityIntroScene')
	}

	preload()
    {
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Making the Game More Interesting')
        curY += header.height()

        const conclusionText = [
            `Let us expand the Coin Toss Game to a group of 16 people, including you. To keep things simple,`,
            '',
            '',
            `1. We will start with every person having exactly the same amount of money.`,
            `2. We will ask the group of people to pair up and for each pair to play the same coin toss game.`,
            `3. We will play multiple rounds of this and see how the distribution of money changes over time.`,
            '',
            `Before we start, what is your guess about how the distribution of wealth will change as the game progresses?\
            Note that we are using just the randomized coin toss as the basis for deciding the transfer of money.\
            There is no skill or hardwork or status or any other factor involved.`,
            '',
            '',
            `Will we end up with:`,
            `1. A normal (Gaussian) distribution?`,
            `2. A flat (Uniform) distribution?`,
            `3. A pyramid (Pareto distribution)?`,
            `4. Some other distribution?`,
            '',
            `Press the "Play the Inequality Game >>>" button when you have made your guess.`
        ]

        let conclusionTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, conclusionText, Constants.bodyTextStyle).setWordWrapWidth(utils.rightX - utils.leftX, true)

        curY += conclusionTextObj.height + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + (utils.rightX - utils.leftX) / 2, curY, 'Play the Inequality Game >>>',
            () => { utils.sceneTransition(this, 'InequalityGameScene', { startingWealth: 1, wagerAmountMin: 1, wagerAmountMax: 1 }) }, true, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}
