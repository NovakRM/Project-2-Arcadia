
var player;
var cursors;
export default class Scene1 extends Phaser.Scene {
    constructor() {
        super('Scene1');
    }
    //preload assets
    preload() {
        cursors = this.input.keyboard.createCursorKeys();

    }
    //create the scene after the preload is done
    create() {
        console.log(13)
        this.add.image(800, 600, 'lvl')
        player = this.physics.add.sprite(32, "hero1");
        this.anims.create({
            key: "left",
            frames:this.anims.generateFrameNumbers('hero1', {start: 0, end: 0}),
            repeat: -1
        });
        this.anims.create({
            key: "down",
            frames:this.anims.generateFrameNumbers('hero1', {start: 0, end: 0}),
            repeat: -1
        });
        this.anims.create({
            key: "right",
            frames:this.anims.generateFrameNumbers('hero1', {start: 0, end: 0})
        });
        this.anims.create({
            key: "up",
            frames:this.anims.generateFrameNumbers('hero1', {start: 0, end: 0})
        });
        //sets player bounds
        player.setCollideWorldBounds(true);
        
    }

    update() {
        
        player.setVelocity(0, 0);

        if(cursors.left.isDown) {
            console.log(50)
            player.setVelocity(-150);
            player.anims.play("left")
        }else if (cursors.right.isDown) {
            player.setVelocity(150);
            player.anims.play("right")
        }else if (cursors.up.isDown) {
            player.setVelocity(-150);
            player.anims.play("up")
        }else if (cursors.down.isDown) {
            player.setVelocity(150);
            player.anims.play("down")
        }
    }
}

