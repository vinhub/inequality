import { Constants } from '../classes/globals'

export default class TextButton extends Phaser.GameObjects.Text
{
    constructor(scene, leftX, topY, text, callback)
    {
    super(scene, leftX, topY, text, Constants.buttonTextStyle);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState() )
      .on('pointerout', () => this.enterButtonRestState() )
      .on('pointerdown', () => this.enterButtonActiveState() )
      .on('pointerup', () => {
        this.enterButtonHoverState();
        callback();
      });
  }

  enterButtonHoverState() {
      this.setStyle({ backgroundColor: '#33a6cc' });
  }

  enterButtonRestState() {
      this.setStyle({ backgroundColor: '#0099cc'});
  }

  enterButtonActiveState() {
      this.setStyle({ backgroundColor: '#33a6cc' });
  }
}
