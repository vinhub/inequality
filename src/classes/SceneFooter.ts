import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import TextButton from '../classes/TextButton';

export default class SceneFooter
{
    line: Phaser.GameObjects.Line
    prevButton?: TextButton
    nextButton?: TextButton
    actionButton?: TextButton

    constructor(scene: Phaser.Scene, leftX: number, topY: number, rightX: number, prevCallback, actionCallback, nextCallback)
    {
        this.line = scene.add.line(0, 0, leftX, topY, 2 * rightX, topY, 0x000000, 0.2);
        this.line.setLineWidth(1)
        const margin: number = 16

        if (prevCallback)
            this.prevButton = scene.add.existing(new TextButton(scene, leftX, topY + margin, '<< Prev', prevCallback).setOrigin(0, 0)) as TextButton

        if (actionCallback)
            this.actionButton = scene.add.existing(new TextButton(scene, leftX + (rightX - leftX) / 2, topY + margin, 'Play Game', actionCallback, true).setOrigin(0.5, 0)) as TextButton

        if (nextCallback)
            this.nextButton = scene.add.existing(new TextButton(scene, rightX, topY + margin, 'Next >>', nextCallback).setOrigin(1, 0).setOrigin(1, 0)) as TextButton
    }
}
