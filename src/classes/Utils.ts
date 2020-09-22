import TextButton from './TextButton'

export default class Utils
{
    leftX: number
    rightX: number
    topY: number
    bottomY: number

    constructor(scene: Phaser.Scene)
    {
        // const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
        const main = scene.cameras.main
        const worldView = main.worldView

        this.leftX = worldView.x + 20
        this.rightX = worldView.x + main.width - 20

        this.topY = worldView.y + 20
        this.bottomY = worldView.y + main.height - 20
    }

    flashText(timeline: Phaser.Tweens.Timeline, textObj: Phaser.GameObjects.Text, text?: string, onComplete?: () => any)
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
            onComplete: () => { if (text) textObj.text = text }
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
            backgroundColor: { from: 0xffffff, to: 0x00ffff }
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
            onComplete: () => { if (onComplete) onComplete() },
            completeDelay: 300
        })
    }
}