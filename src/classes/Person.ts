import Phaser, { Scene } from 'phaser'
import { Constants } from './Globals'
import Utils from '../classes/Utils'

export default class Person
{
	name?: string
	wealth: integer
	message?: string
	messageText?: Phaser.GameObjects.Text
	nameText?: Phaser.GameObjects.Text
	wealthText: Phaser.GameObjects.Text
	personImage: Phaser.GameObjects.Image

	constructor(name?: string, wealth?: integer)
	{
		this.name = name
		this.wealth = (wealth ? wealth : Constants.startingWealth)
		this.wealthText = {} as any
		this.personImage = {} as any
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
			imageColor = new Phaser.Display.Color(0, 0xa0, 0, 0)
		else if (this.wealth <= Constants.unhappyWealthMax)
			imageColor = new Phaser.Display.Color(0xc0, 0, 0, 0)
		else
			imageColor = new Phaser.Display.Color(0x70, 0x70, 0x70, 0)

		return imageColor
	}

	add(scene: Scene, x: number, y: number, message?: string)
	{
		let curY: number = y;

		if (message)
		{
			this.message = message

			this.messageText = scene.add.text(x, curY, this.message, Constants.smallTextStyle).setOrigin(0.5, 0)
			curY += this.messageText.height
        }

		this.personImage = scene.add.image(x, curY, this.imageKey()).setOrigin(0.5, 0)
		this.personImage.setTintFill(this.imageColor().color32)
		curY += this.personImage.height

		if (this.name)
		{
			this.nameText = scene.add.text(x, curY, this.name, Constants.smallTextStyle).setOrigin(0.5, 0)
			curY += this.nameText.height
		}

		this.wealthText = scene.add.text(x, curY, '($' + this.wealth + ')', Constants.smallTextStyle).setOrigin(0.5, 0)
	}

	incrementWealth(utils: Utils, timeline: Phaser.Tweens.Timeline, amount: integer)
	{
		this.wealth += amount
		utils.flashText(timeline, this.wealthText, '($' + this.wealth + ')')
		timeline.add(
		{
			targets: this.personImage,
			scale: { from: 1, to: 1 },
			ease: 'Power3',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
			duration: 0,
			repeat: 0,
			yoyo: false,
			onStart: () =>
			{ this.personImage.setTexture(this.imageKey()); this.personImage.setTintFill(this.imageColor().color32) }
		})
    }
}