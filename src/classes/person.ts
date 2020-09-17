import Phaser, { Scene } from 'phaser'
import { Constants } from './globals'

export default class Person
{
	id: integer
	wealth: integer
	message?: string
	messageText?: Phaser.GameObjects.Text
	nameText?: Phaser.GameObjects.Text
	wealthText?: Phaser.GameObjects.Text
	personImage?: Phaser.GameObjects.Image

	constructor(id: integer, wealth: integer)
	{
		this.id = id
		this.wealth = wealth
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

	add(scene: Scene, x: number, y: number, message: string)
	{
		this.message = message

		let curY: number = y;

		this.messageText = scene.add.text(x, curY, this.message, Constants.smallTextStyle).setOrigin(0.5, 0)
		curY += this.messageText.height

		this.personImage = scene.add.image(x, curY, this.imageKey()).setOrigin(0.5, 0)
		this.personImage.setTintFill(this.imageColor().color32)
		curY += this.personImage.height

		this.nameText = scene.add.text(x, curY, 'Person ' + this.id, Constants.smallTextStyle).setOrigin(0.5, 0)
		curY += this.nameText.height

		this.wealthText = scene.add.text(x, curY, '(Wealth: $' + this.wealth + ')', Constants.smallTextStyle).setOrigin(0.5, 0)
    }
}