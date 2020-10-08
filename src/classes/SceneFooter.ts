import Phaser, { Scene } from 'phaser'
import Utils from '../classes/Utils'
import NavButton from '../classes/NavButton'

export default class SceneFooter
{
    constructor(scene: Phaser.Scene, utils: Utils)
    {
        let curY: number = utils.bottomY - 50

        const rectangle: Phaser.GameObjects.Rectangle = scene.add.rectangle(utils.screenLeftX, curY, utils.screenRightX - utils.screenLeftX, utils.bottomY - curY, 0x000000).setOrigin(0, 0)

        curY += 10

        let scenes: Scene[] = scene.scene.manager.scenes as Scene[]
        let curX: number = utils.screenLeftX + (utils.screenRightX - utils.screenLeftX) / 2 - (scenes.length * 40) / 2 + 8

        for (let iScene: number = 0; iScene < scenes.length; iScene++)
        {
            const sceneKey: string = scenes[iScene].scene.key
            scene.add.existing(new NavButton(scene, curX, curY, (iScene + 1).toString(), () => { utils.sceneTransition(scene, sceneKey) }, scene.scene.key == sceneKey).setOrigin(0, 0))
            curX += 40
        }
    }
}
