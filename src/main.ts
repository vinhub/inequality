import Phaser from 'phaser'

import InequalityGameScene from './scenes/InequalityGameScene'

const config: Phaser.Types.Core.GameConfig = {
	title: 'Wealth Inequality',
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [InequalityGameScene],
	transparent: true
}

let game: Phaser.Game = new Phaser.Game(config)

export default game
