import Phaser, { Scene } from 'phaser'
import { Constants } from './globals'

export default class Person
{
	id: integer
	wealth: integer

	constructor(id: integer)
	{
		this.id = id
		this.wealth = Constants.startingWealth
	}

	imageKey(): string
	{
		return (this.wealth >= Constants.happyWealthMin) ? 'smiley-face' :
			(this.wealth <= Constants.unhappyWealthMax) ? 'unhappy-face' : 'normal-face'
	}

	imageColor(): Phaser.Display.Color
	{
		let imageColor: Phaser.Display.Color

		if (this.wealth >= Constants.happyWealthMin)
			imageColor = new Phaser.Display.Color(0, 0xe0 + (0x1f * Phaser.Math.SmoothStep(this.wealth, 0, 100)), 0)
		else if (this.wealth <= Constants.unhappyWealthMax)
			imageColor = new Phaser.Display.Color(0xe0 + (0x1f * Phaser.Math.SmoothStep(-this.wealth, 0, 100)), 0, 0)
		else
			imageColor = new Phaser.Display.Color(0x80, 0x80, 0x80)

		return imageColor
	}

	add(scene: Scene, x: number, y: number)
	{
		let personImage: Phaser.GameObjects.Image = scene.add.image(x, y, this.imageKey()).setOrigin(0.5, 0.5)

		personImage.setTintFill(this.imageColor().color32)

		let style: Phaser.Types.GameObjects.Text.TextStyle =
		{
			fontFamily: 'Arial, Helvetica, sans-serif',
			fontSize: '14px',
			color: '#000'
		}

		let nameText: Phaser.GameObjects.Text = scene.add.text(x, y + personImage.height, 'Person ' + this.id, style).setOrigin(0.5, 0.5)
		let wealthText: Phaser.GameObjects.Text = scene.add.text(x, y + personImage.height + 20, '(Wealth: $' + this.wealth + ')', style).setOrigin(0.5, 0.5)
    }
}