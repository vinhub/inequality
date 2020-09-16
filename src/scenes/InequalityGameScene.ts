import Phaser from 'phaser'
import Indiv from '../classes/indiv'

export default class InequalityGameScene extends Phaser.Scene
{
    cIndivs: integer = 16;
    indivs: Indiv[] = new Array()

    constructor()
	{
        super('inequality-game')

        for (let iIndiv: integer = 0; iIndiv < this.cIndivs; iIndiv++)
        {
            this.indivs[iIndiv] = new Indiv(iIndiv)
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
        // create the circle of indivs
        let center: Phaser.Geom.Point = new Phaser.Geom.Point(400, 400) // center of circle
        let point: Phaser.Geom.Point = new Phaser.Geom.Point(400, 100)

        // add all the indiv images
        for (let iIndiv: integer = 0; iIndiv < this.indivs.length; iIndiv++)
        {
            // place indivs around the circle uniformly
            let position: Phaser.Geom.Point = Phaser.Math.RotateAround(point, center.x, center.y, Phaser.Math.PI2 * iIndiv / this.indivs.length)
            console.log(iIndiv, Phaser.Math.PI2 * iIndiv / this.indivs.length, position)

            let indivImage: Phaser.GameObjects.Image = this.add.image(position.x, position.y, this.indivs[iIndiv].imageKey())

            let wealth: integer = this.indivs[iIndiv].wealth
            let tintFill: Phaser.Display.Color
            if (wealth > 0)
                tintFill = new Phaser.Display.Color(0, 0xe0 + (0x1f * Phaser.Math.SmoothStep(wealth, 0, 100)), 0)
            else
                tintFill = new Phaser.Display.Color(0xe0 + (0x1f * Phaser.Math.SmoothStep(-wealth, 0, 100)), 0, 0)

            indivImage.setTintFill(tintFill.color32)
        }
    }

    update()
    {

    }
}
