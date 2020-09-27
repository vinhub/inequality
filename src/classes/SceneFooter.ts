import Phaser, { Scene } from 'phaser'
import Utils from '../classes/Utils'
import NavButton from '../classes/NavButton'

export default class SceneFooter
{
    utils: Utils
    line: Phaser.GameObjects.Line

    constructor(scene: Phaser.Scene, leftX: number, topY: number, rightX: number, bottomY: number)
    {
        this.utils = new Utils(scene)

        let curY: number = bottomY - 60

        this.line = scene.add.line(0, 0, leftX, curY, 2 * rightX, curY, 0x000000, 0.2);
        this.line.setLineWidth(1)
        curY += 30

        let scenes: Scene[] = scene.scene.manager.scenes as Scene[]
        let curX: number = leftX + (rightX - leftX) / 2 - (scenes.length * 40) / 2

        for (let iScene: number = 0; iScene < scenes.length; iScene++)
        {
            const sceneKey: string = scenes[iScene].scene.key
            scene.add.existing(new NavButton(scene, curX, curY, () => { this.utils.sceneTransition(scene, sceneKey) }, scene.scene.key == sceneKey))
            curX += 40
        }
    }
}
