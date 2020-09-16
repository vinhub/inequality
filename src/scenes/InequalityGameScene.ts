import Phaser from 'phaser'
import { Constants } from '../classes/globals'
import Person from '../classes/person'

export default class InequalityGameScene extends Phaser.Scene
{
    persons: Person[] = new Array()

    constructor()
	{
        super('InequalityGameScene')

        for (let iPerson: integer = 0; iPerson < Constants.numPersons; iPerson++)
        {
            this.persons[iPerson] = new Person(iPerson, Constants.startingWealth)
        }
	}

	preload()
    {
        this.load.image('normal-face', 'assets/normal-face.png')
        this.load.image('smiley-face', 'assets/smiley-face.png')
        this.load.image('unhappy-face', 'assets/unhappy-face.png')
        this.load.image('dollar-note', 'assets/dollar-note.png')
    }

    create()
    {
        // create the circle of persons
        let center: Phaser.Geom.Point = new Phaser.Geom.Point(400, 400) // center of circle
        let point: Phaser.Geom.Point = new Phaser.Geom.Point(400, 100)

        // add all the person images
        for (let iPerson: integer = 0; iPerson < this.persons.length; iPerson++)
        {
            let person: Person = this.persons[iPerson]

            // place persons around the circle uniformly
            let position: Phaser.Geom.Point = Phaser.Math.RotateAround(point, center.x, center.y, Phaser.Math.PI2 * iPerson / this.persons.length)

            let personImage: Phaser.GameObjects.Image = this.add.image(position.x, position.y, person.imageKey())

            personImage.setTintFill(person.imageColor().color32)
        }
    }

    update()
    {

    }
}
