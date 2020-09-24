import Phaser, { Scene } from 'phaser'
import { Constants } from './Globals'
import Utils from '../classes/Utils'

enum PersonState
{
	Normal,
	Selected,
	Happy,
	Unhappy,
}

export default class Person
{
	isSmall: boolean
	name?: string
	wealth: integer
	message?: string
	messageText: Phaser.GameObjects.Text
	nameText?: Phaser.GameObjects.Text
	wealthText: Phaser.GameObjects.Text
	personImage: Phaser.GameObjects.Image
	state: PersonState

	constructor(name?: string, wealth?: integer, isSmall?: boolean)
	{
		this.name = name
		this.wealth = (wealth ? wealth : Constants.startingWealth)
		this.isSmall = isSmall ? isSmall : false

		this.wealthText = {} as any
		this.personImage = {} as any
		this.messageText = {} as any
		this.state = PersonState.Normal
	}

	imageKey(): string
	{
		let key: string = (this.wealth >= Constants.happyWealthMin) ? 'happy-face' :
			(this.wealth <= Constants.unhappyWealthMax) ? 'unhappy-face' : 'normal-face'

		if (this.isSmall)
			key += '-small'

		return key
	}

	private imageColor(): number
	{
		let imageColor: number

		switch (this.state)
		{
			default:
			case PersonState.Normal:
				imageColor = Constants.grayColor
				break

			case PersonState.Selected:
				imageColor = Constants.blueColor
				break

			case PersonState.Happy:
				imageColor = Constants.greenColor
				break

			case PersonState.Unhappy:
				imageColor = Constants.redColor
				break
        }

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
		this.personImage.setTintFill(this.imageColor())
		curY += this.personImage.height

		if (this.name)
		{
			this.nameText = scene.add.text(x, curY, this.name, Constants.smallTextStyle).setOrigin(0.5, 0)
			curY += this.nameText.height
		}

		this.wealthText = scene.add.text(x, curY, '($' + this.wealth + ')', Constants.smallTextStyle).setOrigin(0.5, 0)
	}

	// add tweens to the timeline to increament (or decrement) wealth and update person display accordingly
	incrementWealth(utils: Utils, timeline: Phaser.Tweens.Timeline, amount: integer)
	{
		//timeline.add(
		//{
		//	targets: this.wealthText,
		//	scale: { from: 1, to: 1 },
		//	duration: 0,
		//	repeat: 0,
		//	yoyo: false,
		//	onStart: () => { this.wealth += amount }
		//})

		// TODO: this should be done on the timeline
		this.wealth += amount 
		this.setState(false)

		utils.flashText(timeline, this.wealthText, '($' + this.wealth + ')')

		timeline.add(
		{
			targets: this.personImage,
			scale: { from: 1, to: 1 },
			duration: 0,
			repeat: 0,
			yoyo: false,
			onStart: () =>
			{ this.personImage.setTexture(this.imageKey()); this.personImage.setTintFill(this.imageColor()) }
		})
	}

	// add tweens to the given timeline to highlight (or unhighlight) the person
	setSelected(timeline: Phaser.Tweens.Timeline, isSelected: boolean)
	{
		timeline.add(
		{
			targets: this.wealthText,
			scale: { from: 1, to: 1 },
			duration: 0,
			repeat: 0,
			yoyo: false,
			onStart: () =>
			{
				this.setState(isSelected)
				this.personImage.setTintFill(this.imageColor())
			}
		})
	}

	setState(isSelected: boolean)
	{
		if (isSelected)
			this.state = PersonState.Selected
		else if (this.wealth >= Constants.happyWealthMin)
			this.state = PersonState.Happy
		else if (this.wealth <= Constants.unhappyWealthMax)
			this.state = PersonState.Unhappy
		else
			this.state = PersonState.Normal
	}

	getState(): PersonState
	{
		return this.state
    }
}