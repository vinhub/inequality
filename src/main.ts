import Phaser from 'phaser'

import IntroScene from './scenes/IntroScene'
import SimpleGameScene from './scenes/SimpleGameScene'
import InequalityGameScene from './scenes/InequalityGameScene'

const config: Phaser.Types.Core.GameConfig = {
	title: 'Evolution of Wealth Inequality',
	type: Phaser.AUTO,
	width: 800,
	height: 900,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [IntroScene, SimpleGameScene, InequalityGameScene],
	transparent: true
}

let game: Phaser.Game = new Phaser.Game(config)

export default game
