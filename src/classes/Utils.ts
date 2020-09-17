export default class Utils
{
    leftX: number
    rightX: number
    width: number
    topY: number

    constructor(scene: Phaser.Scene)
    {
        const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;

        this.leftX = scene.cameras.main.worldView.x + 20
        this.rightX = scene.cameras.main.worldView.x + scene.cameras.main.width - 20
        this.width = this.rightX - this.leftX

        this.topY = scene.cameras.main.worldView.y + 20
    }
}