import Phaser from 'phaser'
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
			imageColor = new Phaser.Display.Color(0, 0, 0)

		return imageColor
    }
}