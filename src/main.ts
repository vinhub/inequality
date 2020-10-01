import Phaser from 'phaser'

import IntroScene from './scenes/IntroScene'
import SimpleGameScene from './scenes/SimpleGameScene'
import InequalityIntroScene from './scenes/InequalityIntroScene'
import InequalityGameScene from './scenes/InequalityGameScene'
import ConclusionScene from './scenes/ConclusionScene'

const config: Phaser.Types.Core.GameConfig = {
	title: 'Evolution of Wealth Inequality',
	width: 1000,
	height: 800,
	type: Phaser.AUTO,
	parent: 'game',
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [IntroScene, SimpleGameScene, InequalityIntroScene, InequalityGameScene, ConclusionScene],
	transparent: true,
}

let game: Phaser.Game = new Phaser.Game(config)
game.scale.on('resize', resize, this)

function resize(gameSize, baseSize, displaySize, resolution)
{
	game.scene.getScenes(true)[0].cameras.resize(gameSize.width, gameSize.height)
}

export default game
