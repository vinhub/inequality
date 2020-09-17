import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import TextButton from '../classes/TextButton';

export default class SceneFooter
{
    footerText: Phaser.GameObjects.Text
    navButton: TextButton

    constructor(scene: Phaser.Scene, leftX: number, topY: number, rightX: number, text: string, callback)
    {
        this.footerText = scene.add.text(leftX, topY, text, Constants.footerTextStyle).setOrigin(0, 0)
        this.navButton = scene.add.existing(new TextButton(this, rightX, topY, 'Next >>', callback)) as TextButton
    }

    height(): number
    {
        return this.navButton.height
    }
}
