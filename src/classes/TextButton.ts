export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, leftX, topY, text, callback)
    {
        let style: Phaser.Types.GameObjects.Text.TextStyle =
        {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#0099cc',
            padding: { left: 12, right: 12, top: 6, bottom: 6 },
        }

    super(scene, leftX, topY, text, style);

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
