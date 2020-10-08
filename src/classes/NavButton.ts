import { Constants } from '../classes/Globals'

export default class NavButton extends Phaser.GameObjects.Arc
{
    isActive: boolean

    constructor(scene: Phaser.Scene, leftX: number, topY: number, text: string, callback: any, isActive: boolean)
    {
        super(scene, leftX, topY, 16)

        this.isActive = isActive

        this.setFillStyle(isActive ? 0xffffff : 0x808080)
        this.setStrokeStyle(1, 0x0000ff)

        scene.add.text(leftX + 16, topY + 16, text, isActive ? Constants.navButtonTextStyleActive : Constants.navButtonTextStyleInactive).setOrigin(0.5, 0.5).setDepth(10)

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
        this.setFillStyle(this.isActive ? 0xffffff : 0x808080)
    }

    enterButtonHoverState()
    {
        this.setFillStyle(0xc0c0c0)
    }

    enterButtonActiveState() 
    {
        this.setFillStyle(0xd3d3d3)
    }
}
