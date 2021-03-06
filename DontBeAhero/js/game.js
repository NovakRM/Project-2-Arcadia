import Preloader from './preload.js'    
import Scene1 from './scene1.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    parent: 'phaser-game',
    scene: [Preloader, Scene1],
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200},
            debug: true
        }
    },
     
};

new Phaser.Game(config);

