import Phaser from 'phaser'

import IntroScene from './scenes/IntroScene'
import SimpleGameScene from './scenes/SimpleGameScene'
import InequalityIntroScene from './scenes/InequalityIntroScene'
import InequalityGameScene from './scenes/InequalityGameScene'
import Discussion1Scene from './scenes/Discussion1Scene'
import Discussion2Scene from './scenes/Discussion2Scene'
import Discussion3Scene from './scenes/Discussion3Scene'
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
	scene: [IntroScene, SimpleGameScene, InequalityIntroScene, InequalityGameScene, Discussion1Scene, Discussion2Scene, Discussion3Scene, CreditsScene],
	transparent: true
}

let game: Phaser.Game = new Phaser.Game(config)

export default game
