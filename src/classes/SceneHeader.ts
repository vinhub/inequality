import Phaser from 'phaser'
import { Constants } from '../classes/globals'

export default class SceneHeader
{
    headerText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, leftX: number, topY: number, text: string)
    {
        this.headerText = scene.add.text(leftX, topY, text, Constants.headerTextStyle).setOrigin(0, 0)
    }

    height(): number
    {
        return this.headerText.height
    }
}
