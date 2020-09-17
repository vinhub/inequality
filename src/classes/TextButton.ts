import { Constants } from '../classes/globals'

export default class TextButton extends Phaser.GameObjects.Text
{
    actionButton: boolean

    constructor(scene, leftX, topY, text, callback, actionButton = false)
    {
        super(scene, leftX, topY, text, actionButton ? Constants.actionButtonTextStyle : Constants.buttonTextStyle);

        this.actionButton = actionButton

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
