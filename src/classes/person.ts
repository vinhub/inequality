import Phaser from 'phaser'

export default class Person
{
	id: integer
	wealth: integer

	constructor(id: integer)
	{
		this.id = id
		this.wealth = 1
	}

	imageKey(): string
	{
		return (this.wealth > 0) ? 'smiley-face' : 'unhappy-face'
	}
}