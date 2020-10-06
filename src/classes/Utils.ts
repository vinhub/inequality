import TextButton from './TextButton'
import { Constants } from './Globals'

export default class Utils
{
    leftX: number
    rightX: number
    topY: number
    bottomY: number
    width: number
    height: number
    portraitMode: boolean

    constructor(scene: Phaser.Scene)
    {
        // const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
        const main = scene.cameras.main
        const worldView = main.worldView

        this.leftX = worldView.x + 20
        this.rightX = worldView.x + main.width - 20
        this.width = main.width - 40

        this.topY = worldView.y + 20
        this.bottomY = worldView.y + main.height - 20
        this.height = main.height - 40

        this.portraitMode = (this.width < this.height)

        if (!this.portraitMode)
        {
            Constants.bodyTextStyle.fontSize = '18px'
            Constants.bodyBoldTextStyle.fontSize = '18px'
            Constants.headerTextStyle.fontSize = '20px'
            Constants.buttonTextStyle.fontSize = '20px'
            Constants.actionButtonTextStyle.fontSize = '20px'
        }
    }

    flashText(timeline: Phaser.Tweens.Timeline, textObj: Phaser.GameObjects.Text, text?: string | string[], onComplete?: () => any)
    {
        timeline.add(
        {
            targets: textObj,
            alpha: { from: 1, to: 0 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            delay: 300,
            repeat: 0,
            yoyo: false,
            onComplete: () => { if (text) textObj.setText(text) }
        })

        timeline.add(
        {
            targets: textObj,
            alpha: { from: 0, to: 1 },
            backgroundColor: { from: 0xffffff, to: 0x00ffff },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
        })

        timeline.add(
        {
            targets: textObj,
            alpha: { from: 1, to: 0 },
            backgroundColor: { from: 0x00ffff, to: 0xffffff },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
        })

        timeline.add(
        {
            targets: textObj,
            alpha: { from: 0, to: 1 },
            backgroundColor: { from: 0xffffff, to: 0x00ffff },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
            onComplete: () => { if (onComplete) onComplete() },
            completeDelay: 300
        })
    }

    flashTexts(timeline: Phaser.Tweens.Timeline, textObjs: Phaser.GameObjects.Text[], texts?: string[], onComplete?: () => any)
    {
        timeline.add(
            {
                targets: textObjs,
                alpha: { from: 1, to: 0 },
                ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 300,
                delay: 300,
                repeat: 0,
                yoyo: false,
                onComplete: () =>
                {
                    if (texts)
                    {
                        for (let iText = 0; iText < texts.length; iText++)
                            textObjs[iText].setText(texts[iText])
                    }
                }
            })

        timeline.add(
            {
                targets: textObjs,
                alpha: { from: 0, to: 1 },
                backgroundColor: { from: 0xffffff, to: 0x00ffff },
                ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 300,
                repeat: 0,
                yoyo: false,
            })

        timeline.add(
            {
                targets: textObjs,
                alpha: { from: 1, to: 0 },
                backgroundColor: { from: 0x00ffff, to: 0xffffff },
                ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 300,
                repeat: 0,
                yoyo: false,
            })

        timeline.add(
            {
                targets: textObjs,
                alpha: { from: 0, to: 1 },
                backgroundColor: { from: 0xffffff, to: 0x00ffff },
                ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 300,
                repeat: 0,
                yoyo: false,
                onComplete: () => { if (onComplete) onComplete() },
                completeDelay: 300
            })
    }

    sceneTransition(curScene: Phaser.Scene, transitionTo: string, data?: object | undefined)
    {
        curScene.cameras.main.fadeOut(500, 0xff, 0xff, 0xff)
        curScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) =>
        {
            curScene.scene.start(transitionTo, data)
        })
    }
}