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
	wealth: integer
	name?: string
	isSmall: boolean

	messageText: Phaser.GameObjects.Text
	nameText?: Phaser.GameObjects.Text
	wealthText: Phaser.GameObjects.Text
	personImage: Phaser.GameObjects.Image
	state: PersonState

	startingAmount: number

	constructor(wealth: integer, isSmall: boolean, name?: string)
	{
		this.name = name
		this.wealth = wealth
		this.isSmall = isSmall

		this.wealthText = {} as any
		this.personImage = {} as any
		this.messageText = {} as any
		this.state = PersonState.Normal

		this.startingAmount = wealth
	}

	imageKey(): string
	{
		let key: string

		switch (this.state)
		{
			default:
			case PersonState.Normal:
				key = 'normal-face'
				break

			case PersonState.Happy:
				key = 'happy-face'
				break

			case PersonState.Unhappy:
				key = 'unhappy-face'
				break
		}

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

	add(scene: Scene, x: number, y: number, scaleFactor: number)
	{
		let curY: number = y;

		this.messageText = scene.add.text(x, curY, '', Constants.smallTextStyle).setOrigin(0.5, 0).setScale(scaleFactor)
		this.updateStateMessage()
		curY += this.messageText.height * scaleFactor

		this.personImage = scene.add.image(x, curY, this.imageKey()).setOrigin(0.5, 0).setScale(scaleFactor)
		curY += this.personImage.height * scaleFactor

		if (this.name)
		{
			this.nameText = scene.add.text(x, curY, this.name, Constants.smallTextStyle).setOrigin(0.5, 0).setScale(scaleFactor)
			curY += this.nameText.height * scaleFactor
		}

		this.wealthText = scene.add.text(x, curY, `($${this.wealth})`, Constants.smallTextStyle).setOrigin(0.5, 0).setScale(scaleFactor)
	}

	setWealth(amount: number)
	{
		this.wealth = amount
		this.wealthText.text = `($${this.wealth})`
		this.setState(false)
		this.personImage.setTexture(this.imageKey())
	}

	// add tweens to the timeline to increament (or decrement) wealth and update person display accordingly
	incrementWealth(utils: Utils, timeline: Phaser.Tweens.Timeline, amount: integer)
	{
		const tempObj = { val: 0 }

		timeline.add(
		{
			targets: tempObj,
			val: 1,
			duration: 0,
			repeat: 0,
			yoyo: false,
			onStart: () => { this.setWealth(this.wealth + amount) }
		})

		utils.flashText(timeline, this.wealthText)
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
				//this.personImage.setTintFill(this.imageColor())
			}
		})
	}

	setState(isSelected: boolean)
	{
		if (isSelected)
			this.state = PersonState.Selected
		else if (this.wealth > this.startingAmount)
			this.state = PersonState.Happy
		else if (this.wealth <= 0)
			this.state = PersonState.Unhappy
		else
			this.state = PersonState.Normal
	}

	getState(): PersonState
	{
		return this.state
	}

	updateStateMessage()
	{
		let message: string

		switch (this.state)
		{
			default:
			case PersonState.Normal:
				message = `"Gettin' by."`
				break

			case PersonState.Happy:
				message = `"Doin' well!"`
				break

			case PersonState.Unhappy:
				message = `"I'm broke!"`
				break
		}

		this.messageText.text = message
    }
}