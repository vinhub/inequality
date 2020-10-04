import Phaser from 'phaser'
import { BBCodeText } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
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

    create()
    {
        this.cameras.main.fadeIn(500, 0xff, 0xff, 0xff)

        let utils: Utils = new Utils(this)
        let curY = utils.topY;

        let header: SceneHeader = new SceneHeader(this, utils.leftX, curY, utils.rightX, 'Conclusion: Evolution of Wealth Inequality')
        curY += header.height()

        const conclusionText = [
            `As you can see, in every case, extreme wealth inequality emerges in spite of this being a completely randomized game. We did not need to introduce any other factor such as skill or hard work or social status etc. into the game and yet it emerged.`,
            '',
            `Here is the critical point to learn from this exercise: As a person\'s assets shrink, the maximum amount they can risk also shrinks. And as a person\'s assets grow, the maximum amount they can risk also grows. This is the essential factor that enables those with higher assets to grow their assets even further, while those whith fewer assets fall further and further behind. The extreme example of this is that once a person has no assets, they can't even play the game anymore.`,
            '',
            `While one can argue that a moderate level of wealth inequality is inevitable and possibly even healthy for a society, extreme inequality has historically led to serious problems. This is why it is important for everyone to understand how inequality emerges in a society and find ways to contol it.`,
            '',
            '[b]Credits:[/b]',
            `This game has been developed by Vinayak (Vin) Bhalerao at [area=url:https://redmondlabs.com][u][color=#1e90ff]Redmond Labs Consulting[/color][/u][/area].`,
            '',
            `It is based on the work of [area=url:https://howardaldrich.org][u][color=#1e90ff]Dr. Howard Aldrich[/color][/u][/area]. Please refer to his [area=url:https://eiexchange.com/content/229-coin-toss-game-examines-interplay-of-skill-and-f][u][color=#1e90ff]paper on this topic[/color][/u][/area] for more information.`,
            '',
            'Thank you very much for your time!'
        ]

        const conclusionTextObj: BBCodeText = new BBCodeText(this, utils.leftX, curY, conclusionText, Constants.bodyTextStyle)
            .setWrapWidth(utils.rightX - utils.leftX).setWrapMode('word')
            .setInteractive()
            .on('areaup', function (key)
            {
                window.open(key.substring(4, key.length), '_blank')
            })

        this.add.existing(conclusionTextObj)

        curY += conclusionTextObj.height + 20

        let actionButton1: TextButton = this.add.existing(new TextButton(this, utils.rightX - 280, curY, 'Play Again?',
            () => { utils.sceneTransition(this, 'InequalityGameScene') }, true, true).setOrigin(0, 0)) as TextButton

        let actionButton2: TextButton = this.add.existing(new TextButton(this, actionButton1.x + actionButton1.width + 10, curY, 'Further Reading',
            () => { window.open('assets/further-reading.html', '_blank'); }, true, false).setOrigin(0, 0)) as TextButton

        curY += actionButton1.height + 20

        let footer: SceneFooter = new SceneFooter(this, utils.leftX, curY, utils.rightX, utils.bottomY)
    }
}