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
        this.load.image('dist-normal', 'assets/dist-normal.gif')
        this.load.image('dist-uniform', 'assets/dist-uniform.gif')
        this.load.image('dist-pareto', 'assets/dist-pareto.gif')
        this.load.image('dist-unknown', 'assets/dist-unknown.gif')
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        const utils: Utils = new Utils(this)
        let curY = utils.topY;

        const header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Making the Game More Interesting')
        curY += header.height()

        const conclusionText = [
            `Let us expand the Coin Toss Game to a group of 16 people, including you. To keep things simple,`,
            '',
            `1. We will start with every person having exactly the same amount of money.`,
            `2. We will ask the group of people to pair up and for each pair to play the same coin toss game.`,
            `3. We will play multiple rounds of this and see how the distribution of money changes over time.`,
            '',
            'Note that we are using just the randomized coin toss as the basis for the transfer of money. There is no skill, hardwork, status or any other factor involved.',
            '',
            `Before we start, what distribution of wealth do you think we will end up with? (x: wealth, y: # people):`
        ]

        const conclusionTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, conclusionText, Constants.bodyTextStyle).setWordWrapWidth(utils.rightX - utils.leftX, false)

        curY += conclusionTextObj.height + 10

        // add images for the distributions
        const img1: Phaser.GameObjects.Image = this.add.image(utils.leftX + 20, curY, 'dist-normal').setOrigin(0, 0)
        const img2: Phaser.GameObjects.Image = this.add.image(img1.getBottomRight().x + 40, curY, 'dist-uniform').setOrigin(0, 0)

        curY += img1.height + 10

        const img3: Phaser.GameObjects.Image = this.add.image(utils.leftX + 20, curY, 'dist-pareto').setOrigin(0, 0)
        const img4: Phaser.GameObjects.Image = this.add.image(img3.getBottomRight().x + 40, curY, 'dist-unknown').setOrigin(0, 0)

        curY += img3.height + 10

        const nextText = `Press "Play the Game" after making your guess.`

        const nextTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, nextText, Constants.bodyTextStyle).setWordWrapWidth(utils.rightX - utils.leftX, false)

        curY += nextTextObj.height + 10

        const actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + (utils.rightX - utils.leftX) / 2, curY, 'Play the Game',
            () => { utils.sceneTransition(this, 'InequalityGameScene', { gameLevel: 1 }) }, true, true).setOrigin(0.5, 0)) as TextButton

        const footer: SceneFooter = new SceneFooter(this, utils)
    }
}
