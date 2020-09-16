import Phaser from 'phaser'
import Person from '../classes/person'

export default class InequalityGameScene extends Phaser.Scene
{
    cPersons: integer = 16;
    persons: Person[] = new Array()

    constructor()
	{
        super('inequality-game')

        for (let iPerson: integer = 0; iPerson < this.cPersons; iPerson++)
        {
            this.persons[iPerson] = new Person(iPerson)
        }
	}

	preload()
    {
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
            // place persons around the circle uniformly
            let position: Phaser.Geom.Point = Phaser.Math.RotateAround(point, center.x, center.y, Phaser.Math.PI2 * iPerson / this.persons.length)
            console.log(iPerson, Phaser.Math.PI2 * iPerson / this.persons.length, position)

            let personImage: Phaser.GameObjects.Image = this.add.image(position.x, position.y, this.persons[iPerson].imageKey())

            let wealth: integer = this.persons[iPerson].wealth
            let tintFill: Phaser.Display.Color
            if (wealth > 0)
                tintFill = new Phaser.Display.Color(0, 0xe0 + (0x1f * Phaser.Math.SmoothStep(wealth, 0, 100)), 0)
            else
                tintFill = new Phaser.Display.Color(0xe0 + (0x1f * Phaser.Math.SmoothStep(-wealth, 0, 100)), 0, 0)

            personImage.setTintFill(tintFill.color32)
        }
    }

    update()
    {

    }
}
