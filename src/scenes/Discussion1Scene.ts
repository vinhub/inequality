import Phaser from 'phaser'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import TextButton from '../classes/TextButton';

export default class Discussion1Scene extends Phaser.Scene
{
    constructor()
    {
        super('Discussion1Scene')
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Discussion - 1')
        curY += header.height()

        const discussionText = [
            `As you can see, in every case, the distribution of wealth becomes extremely lopsided (known as a Pareto distribution) in spite of this being a completely randomized game. ` +
            `Were you able to guess that correctly?`,
            '',
            `Here is the critical point to learn from this exercise: As a person\'s assets shrink, the maximum amount they can risk also shrinks. ` +
            `And as a person\'s assets grow, the maximum amount they can risk also grows. ` +
            `This is the essential factor that enables those with higher assets to grow their assets even further, while those whith fewer assets fall further and further behind. ` +
            `In the extreme case, where a person has no assets, they can't even play the game anymore. `,
            '',
            `While using a coin toss for deciding how to transfer money is not realistic, the factor above still holds true in the real world. ` +
            'To further understand how this simulation relates to real-world processes that generate inequality, let us consider how modifications of the rules might alter the outcome.',
        ]

        const discussionTextObj: Phaser.GameObjects.Text = this.add.text(utils.leftX, curY, discussionText, Constants.bodyTextStyle).setWordWrapWidth(utils.rightX - utils.leftX, false)

        curY += discussionTextObj.height + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + utils.width / 2, curY, 'Continue Discussion',
            () => { utils.sceneTransition(this, 'Discussion2Scene') }, true, true).setOrigin(0.5, 0)) as TextButton

        let footer: SceneFooter = new SceneFooter(this, utils)
    }
}