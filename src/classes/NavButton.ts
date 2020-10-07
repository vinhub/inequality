import { Constants } from '../classes/Globals'

export default class NavButton extends Phaser.GameObjects.Arc
{
    isActive: boolean

    constructor(scene: Phaser.Scene, leftX: number, topY: number, callback: any, isActive: boolean)
    {
        super(scene, leftX, topY, 16)

        this.isActive = isActive

        this.setFillStyle(isActive ? 0x5bc0de : 0x808080)
        this.setStrokeStyle(1, 0x0000ff)

        this.setInteractive({ useHandCursor: true })
          .on('pointerover', () => this.enterButtonHoverState() )
          .on('pointerout', () => this.enterButtonRestState() )
          .on('pointerdown', () => this.enterButtonActiveState() )
          .on('pointerup', () => {
            this.enterButtonHoverState();
            callback();
          });
    }

    enterButtonRestState() 
    {
        this.setFillStyle(this.isActive ? 0x5bc0de : 0x808080)
    }

    enterButtonHoverState()
    {
        this.setFillStyle(0x31b0d5)
    }

    enterButtonActiveState() 
    {
        this.setFillStyle(0x269abc)
    }
}
