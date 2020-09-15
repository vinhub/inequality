import Phaser from 'phaser'

import InequalityGameScene from './scenes/InequalityGameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [InequalityGameScene]
}

export default new Phaser.Game(config)
