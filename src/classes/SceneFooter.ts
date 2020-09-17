import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import TextButton from '../classes/TextButton';

export default class SceneFooter
{
    footerText: Phaser.GameObjects.Text
    navButton: TextButton

    constructor(scene: Phaser.Scene, leftX: number, topY: number, rightX: number, footerText: string, navButtonText: string, navCallback)
    {
        this.footerText = scene.add.text(leftX, topY, footerText, Constants.footerTextStyle).setOrigin(0, 0)
        this.navButton = scene.add.existing(new TextButton(scene, rightX, topY, navButtonText, navCallback).setOrigin(1, 0)) as TextButton
    }

    height(): number
    {
        return this.navButton.height
    }
}
