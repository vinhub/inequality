import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import TextButton from '../classes/TextButton';

export default class SceneFooter
{
    prevButton?: TextButton
    nextButton?: TextButton
    actionButton?: TextButton

    constructor(scene: Phaser.Scene, leftX: number, topY: number, rightX: number, prevCallback, actionCallback, nextCallback)
    {
        if (prevCallback)
            this.prevButton = scene.add.existing(new TextButton(scene, leftX, topY, '<< Prev', prevCallback).setOrigin(0, 0)) as TextButton

        if (actionCallback)
            this.actionButton = scene.add.existing(new TextButton(scene, leftX + (rightX - leftX) / 2, topY, 'Play Game', actionCallback).setOrigin(0.5, 0)) as TextButton

        if (nextCallback)
            this.nextButton = scene.add.existing(new TextButton(scene, rightX, topY, 'Next >>', nextCallback).setOrigin(1, 0).setOrigin(1, 0)) as TextButton

    }
}
