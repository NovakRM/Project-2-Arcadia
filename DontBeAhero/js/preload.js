//preload assets
export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    preload = function() {
        console.log(5)
        this.load.image('lvl', '../assets/firstLvl.tmx')
        this.load.spritesheet("hero1", "../assets/hero1.png", {
        frameWidth: 32,
        frameHeight: 32
        })
        
    }
}