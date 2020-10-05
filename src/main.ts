import Phaser from 'phaser'

import IntroScene from './scenes/IntroScene'
import SimpleGameScene from './scenes/SimpleGameScene'
import InequalityIntroScene from './scenes/InequalityIntroScene'
import InequalityGameScene from './scenes/InequalityGameScene'
import ConclusionScene from './scenes/ConclusionScene'
import CreditsScene from './scenes/CreditsScene'

const config: Phaser.Types.Core.GameConfig = {
	title: 'Evolution of Wealth Inequality',
	width: '100%',
	height: '100%',
	type: Phaser.Scale.RESIZE,
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
	scene: [IntroScene, SimpleGameScene, InequalityIntroScene, InequalityGameScene, ConclusionScene, CreditsScene],
	transparent: true,
}

let game: Phaser.Game = new Phaser.Game(config)

export default game
