import Phaser from 'phaser'
import { Constants } from '../classes/globals'

export default class SceneHeader
{
    headerText: Phaser.GameObjects.Text
    line: Phaser.GameObjects.Line

    constructor(scene: Phaser.Scene, leftX: number, topY: number, rightX: number, text: string)
    {
        this.headerText = scene.add.text(leftX, topY, text, Constants.headerTextStyle).setOrigin(0, 0)
        const textHeight: number = this.headerText.height
        this.line = scene.add.line(0, 0, leftX, topY + textHeight, 2 * rightX, topY + textHeight, 0x000000, 0.2);
        this.line.setLineWidth(1)
    }

    height(): number
    {
        return this.headerText.height + this.line.height + 16
    }
}
