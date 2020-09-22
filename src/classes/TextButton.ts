import { Constants } from '../classes/Globals'
import { Scene } from 'phaser';

export default class TextButton extends Phaser.GameObjects.Text
{
    actionButton: boolean
    callback: () => void

    constructor(scene: Scene, leftX: number, topY: number, text: string, callback: () => void, actionButton: boolean = false)
    {
        super(scene, leftX, topY, text, actionButton ? Constants.actionButtonTextStyle : Constants.buttonTextStyle);

        this.actionButton = actionButton
        this.callback = callback

        this.setInteractive({ useHandCursor: true })
          .on('pointerover', () => this.enterButtonHoverState() )
          .on('pointerout', () => this.enterButtonRestState() )
          .on('pointerdown', () => this.enterButtonActiveState() )
          .on('pointerup', () => {
            this.enterButtonHoverState();
            this.callback();
          });
    }

    enterButtonRestState() 
    {
        this.setStyle({ backgroundColor: this.actionButton ? '#5cb85c' : '#5bc0de' });
    }

    enterButtonHoverState()
    {
        this.setStyle({ backgroundColor: this.actionButton ? '#449d44' : '#31b0d5' });
    }

    enterButtonActiveState() 
    {
        this.setStyle({ backgroundColor: this.actionButton ? '#398439' : '#269abc' });
    }
}
