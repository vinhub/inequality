export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, callback)
    {
        let style: Phaser.Types.GameObjects.Text.TextStyle =
        {
            fontFamily: 'Georgia, Arial, Helvetica, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#0099cc',
            padding: { left: 12, right: 12, top: 6, bottom: 6 },
        }

    super(scene, x, y, text, style);

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
