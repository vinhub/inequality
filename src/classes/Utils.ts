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

    setText(timeline: Phaser.Tweens.Timeline, textObj: Phaser.GameObjects.Text, text: string)
    {
        timeline.add(
        {
            targets: textObj,
            alpha: { from: 1, to: 0 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,
            yoyo: false,
            onComplete: () => { textObj.text = text }
        })

        timeline.add(
        {
            targets: textObj,
            alpha: { from: 0, to: 1 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,
            yoyo: false,
        })
    }

    flashText(timeline: Phaser.Tweens.Timeline, textObj: Phaser.GameObjects.Text, text?: string)
    {
        if (text)
            this.setText(timeline, textObj, text)

        timeline.add(
        {
            targets: textObj,
            scale: { from: 1, to: 1.5 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
        })

        timeline.add(
        {
            targets: textObj,
            scale: { from: 1.5, to: 1 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
        })

        timeline.add(
        {
            targets: textObj,
            scale: { from: 1, to: 1.5 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
        })

        timeline.add(
        {
            targets: textObj,
            scale: { from: 1.5, to: 1 },
            ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: 0,
            yoyo: false,
        })
    }
}