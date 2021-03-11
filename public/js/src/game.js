//import the Phaser object
import Phaser from './lib/phaser.js';

//import the game class 
import Game from './scenes/scene1.js';
import GameOver from './scenes/gameOver.js'

//creates a new instance of Phaser.Game
export default new Phaser.Game ({
    type: Phaser.AUTO,
    width: 640,
    height:480,
    scene: [Game],
    parent:game2,
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:200
            },
            debug: true
        }
    }
})
