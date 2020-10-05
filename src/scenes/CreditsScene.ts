import Phaser from 'phaser'
import { BBCodeText } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
import { Constants } from '../classes/Globals'
import Utils from '../classes/Utils'
import SceneHeader from '../classes/SceneHeader';
import SceneFooter from '../classes/SceneFooter';
import TextButton from '../classes/TextButton';

export default class CreditsScene extends Phaser.Scene
{
    constructor()
    {
        super('CreditsScene')
    }

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Credits: Evolution of Wealth Inequality')
        curY += header.height()

        const creditsText = [
            'Ultimately, you should come to realize that the final distribution of wealth and your personal chances of becoming a winner are not flukes, but rather the result of the rules of play that determine who wins and why. You should also realize that even in the real world, where skill and effort do matter, your ability to get ahead and chances of falling behind are also determined by taken-for-granted rules and structures of opportunities.',
            '',
            '[b]Credits:[/b]',
            '',
            `This game has been developed by Vinayak (Vin) Bhalerao at [area=url:https://redmondlabs.com][u][color=#1e90ff]Redmond Labs Consulting[/color][/u][/area].`,
            '',
            `It is based on the work of [area=url:https://howardaldrich.org][u][color=#1e90ff]Dr. Howard Aldrich[/color][/u][/area]. Please refer to his [area=url:https://eiexchange.com/content/229-coin-toss-game-examines-interplay-of-skill-and-f][u][color=#1e90ff]paper on this topic[/color][/u][/area] for more information.`,
            '',
            `I was also inspired by Nicky Case's [area=url:https://ncase.me/trust/][u][color=#1e90ff]"The Evolution of Trust"[/color][/u][/area] that explains another important concept that affects society.`,
            '',
            'Thank you very much for your time!'
        ]

        const creditsTextObj: BBCodeText = new BBCodeText(this, utils.leftX, curY, creditsText, Constants.bodyTextStyle)
            .setWrapWidth(utils.rightX - utils.leftX).setWrapMode('word')
            .setInteractive()
            .on('areaup', function (key)
            {
                window.open(key.substring(4, key.length), '_blank')
            })

        this.add.existing(creditsTextObj)

        curY += creditsTextObj.height + 20

        let actionButton: TextButton = this.add.existing(new TextButton(this, utils.leftX + utils.width / 2, curY, 'Play Again?',
            () => { utils.sceneTransition(this, 'InequalityGameScene') }, true, true).setOrigin(0.5, 0)) as TextButton

        curY += actionButton.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}