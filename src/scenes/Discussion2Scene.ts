import Phaser from 'phaser';
import { BBCodeText } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
import { Constants } from '../classes/Globals';
import SceneFooter from '../classes/SceneFooter';
import SceneHeader from '../classes/SceneHeader';
import TextButton from '../classes/TextButton';
import Utils from '../classes/Utils';

export default class Discussion2Scene extends Phaser.Scene
{
    constructor()
    {
        super('Discussion2Scene')
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Discussion - 2')
        curY += header.height()

        const discussionText = [
            '[b]What would happen if some players started the game with a different number of coins?[/b]',
            '',
            'Imagine a society in which people of different social origins have very different levels of wealth. When a player with five coins bets two and loses, she has lost 40 percent of her assets but is still solvent. By contrast, when someone with two coins bets both of them and loses, they have lost 100 percent of their assets and are out of the game. In short, an initial advantage goes a long way toward success, whereas an initial disadvantage leaves players behind rather quickly. In life, the valued good may be education, or income, or wealth rather than coins, but initial advantages are still important.',
            '',
            '[b]What would happen if bankrupt players could borrow money to get back into the game?[/b]',
            '',
            'Consider the role of financial institutions, credit agencies, and other sources of capital. Large organizations, for instance, have access to huge amounts of credit and, in some cases, are not allowed to fail. In a similar fashion, some people have better access to credit than others and are thus better able to handle economic misfortune. In essence, the game provides a level playing field by denying everyone access to credit; but in the real world, people have unequal access to credit and thus different chances of amassing wealth or going broke.',
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

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + utils.width / 2, curY, 'Continue Discussion',
            () => { utils.sceneTransition(this, 'Discussion3Scene') }, true, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}