import Phaser from 'phaser'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import TextButton from '../classes/TextButton';

export default class ConclusionScene extends Phaser.Scene
{
	constructor()
	{
		super('ConclusionScene')
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

        const conclusionText = [
            'Conclusion:',
            '',
            `As you can see, in every case, extreme wealth inequality emerges in spite of this being a completely randomized game.
             We did not introduce any other factor such as skill or hard work or social status etc. into the picture and yet it emerged.`,
            '',
            '',
            `While one can argue that a moderate level of wealth inequality is natural and even healthy for a society, extreme inequality is never healthy.
             We must prevent it from reaching such extremes.`,
            '',
            '',
            'Credits:',
            'This game has been developed purely for educational purposes by Vinayak (Vin) Bhalerao at Redmond Labs Consulting (https://redmondlabs.com).',
            '',
            '',
            'The game is based on the work of Dr. Howard Aldrich (https://howardaldrich.org).',
            'His paper on this topic can be seen at https://eiexchange.com/content/229-coin-toss-game-examines-interplay-of-skill-and-f.',
            '',
            '',
            'Thank you very much for your time!'
        ]

        let conclusionTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, conclusionText, Constants.bodyTextStyle).setWordWrapWidth(utils.rightX - utils.leftX, true)

        curY += conclusionTextObj.height + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + (utils.rightX - utils.leftX) / 2, curY, 'Play Again? >>>',
            () => { this.scene.start('IntroScene') }, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}
