import Phaser from 'phaser'
import { BBCodeText } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import TextButton from '../classes/TextButton';

export default class Discussion3Scene extends Phaser.Scene
{
    constructor()
    {
        super('Discussion3Scene')
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Discussion - 3')
        curY += header.height()

        const discussionText = [
            '[b]What are the possible consequences of allowing some players to pool their resources and play as a group?[/b]',
            '',
            'In the game, everyone plays as an individual, but in real life, we are connected to groups of relatives, friends, and acquaintances who have economic and non-economic resources that can help or hinder our efforts to succeed.',
            '',
            '[b]What would happen if a wealth or inheritance tax had been imposed between rounds?[/b]',
            '',
            'Think about the inter-generational transfer of wealth, or income or property taxes and how taxes and the social welfare system might restrict the amount of income inequality in a society. The basic point is that societies usually limit inequality by imposing restrictions on the accumulation and transmission of wealth. The game provides no such safeguards.',
            '',
            '[b]What would happen if you could buffer yourself against losses?[/b]',
            '',
            'This brings up the options of withdrawing from the game or protecting against competition through local isolation or creation of IP, or other competitive barriers.',
        ]

        const discussionTextObj: BBCodeText = new BBCodeText(this, utils.leftX, curY, discussionText, Constants.smallTextStyle)
            .setWrapWidth(utils.rightX - utils.leftX).setWrapMode('word')
            .setInteractive()
            .on('areaup', function (key)
            {
                window.open(key.substring(4, key.length), '_blank')
            })

        this.add.existing(discussionTextObj)

        curY += discussionTextObj.height + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + utils.width / 2, curY, 'Final Thoughts',
            () => { utils.sceneTransition(this, 'CreditsScene') }, true, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}