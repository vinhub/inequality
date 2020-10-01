import { Constants } from '../classes/Globals'
import { Scene } from 'phaser';

export default class TextButton extends Phaser.GameObjects.Text
{
    private actionButton: boolean
    private callback: () => void
    private isDisabled: boolean

    constructor(scene: Scene, leftX: number, topY: number, text: string, callback: () => void, actionButton: boolean = false, disableOnClick: boolean = false)
    {
        super(scene, leftX, topY, text, actionButton ? Constants.actionButtonTextStyle : Constants.buttonTextStyle);

        this.actionButton = actionButton
        this.callback = callback
        this.isDisabled = false

        this.setInteractive({ useHandCursor: true })
          .on('pointerover', () => this.enterButtonHoverState() )
          .on('pointerout', () => this.enterButtonRestState() )
          .on('pointerdown', () => this.enterButtonActiveState() )
            .on('pointerup', () =>
            {
                if (this.isDisabled)
                    return
                if (disableOnClick)
                    this.enterButtonDisabledState()
                this.callback()
            });
    }

    enterButtonRestState() 
    {
        this.setStyle({ backgroundColor: this.isDisabled ? '#cccccc' : this.actionButton ? '#5cb85c' : '#5bc0de' });
    }

    enterButtonHoverState()
    {
        this.setStyle({ backgroundColor: this.isDisabled ? '#cccccc' : this.actionButton ? '#449d44' : '#31b0d5' });
    }

    enterButtonActiveState() 
    {
        this.setStyle({ backgroundColor: this.isDisabled ? '#cccccc' : this.actionButton ? '#398439' : '#269abc' });
    }

    enterButtonDisabledState() 
    {
        this.isDisabled = true
        this.setStyle({ backgroundColor: '#cccccc' });
        this.removeInteractive()
    }

    setCallback(text: string, callback: () => any)
    {
        this.text = text
        this.callback = callback
        this.isDisabled = false
        this.setInteractive({ useHandCursor: true })
        this.enterButtonRestState()
    }
}
