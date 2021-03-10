import Phaser from '../lib/phaser.js';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over')
    }

    create() {

        //use the scale manager to get width and height instead of hard coding it in
        const width = Phaser.width
        const height = Phaser.height

        this.add.text(width * 0.5, height * 0.5, 'Game Over', {
            fontSize: 48
        }).setOrigin(0.5)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })
    }

}