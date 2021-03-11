import Phaser from '../lib/phaser.js';
import Star from  '../game/star.js';
import GameOver from '../scenes/gameOver.js'
import phaser from '../lib/phaser.js';


var scoreText;
var gameOver = false;
export default class Game extends Phaser.Scene {
    //allows Intelliscense to continue providing help with player property
    //----Phaser properties-------
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    /** @type {Phaser.Physics.Arcade.Group} */
    star
    /** @type {Phaser.GameObjects.Text} */
    starCollectedText = 'Star : 0'

    starCollected = 0;
    isClicking = false;

    
    constructor()
    {
        super('game')
    }
    //called before preload is called. good place for clearing variables
    init() {
        this.starCollected = 0;
    }

    //called to allow us to specify images, audio, and other assets that need to load before starting the scene.
    preload() {
        //load has logic for loading images, audio, spritesheets, etc.
        //the first parameter is the 'key' or name and the second is the path to the asset.
        //key is used as a reference later to call the object.
        //the path is not relevant
        //background image
        this.load.image('background', 'assets/bg_layer1.png')
        //platform images
        this.load.image('platform', 'assets/stone.png')
        this.load.image('hero-idle', 'assets/hero1.png')
        this.load.image('hero-jump', 'assets/hero2.png')
        this.load.image('chain', 'assets/chain.png')
        //star
        this.load.image('star', 'assets/star.png')
        //player input
        //another class property. Can be made in either preload or the create function.
        this.cursors = this.input.keyboard.createCursorKeys();

        //------audio-------
        this.load.audio('jump', 'assets/sfx/phaseJump1.ogg')
        
    }
    //called after preload has loaded the assets. Only assets that have been loaded can be called in the create function.
    create() {
        
        //--------background--------
        //first parameter is the x value, second y value and the last parament is the key to call the object.
        //setScrollFactor(x, y)- keeps the object from scrolling
        this.add.image(240, 320, 'background').setScrollFactor(1, 0);
        //setscale to 'scale' your game objects
        //tells Phaser to add 'physics' to the object
        // this.physics.add.image(240, 320, 'platform').setScale(0.5)
        //--------platforms---------
        //create the group
        
        this.platforms = this.physics.add.staticGroup()
        
        for(let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(32, 472)
            const y = 150 * i;

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create (x, y, 'platform')
            platform.setScale(0.3);
            
            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body;
            body.updateFromGameObject();
        }

        //--------player---------
        //use class property instead of local variable
        this.player = this.physics.add.sprite(240, 320, 'hero-idle').setScale(2);
        //add a collider to the sprite so itll know what to react to.
        this.physics.add.collider(this.platforms, this.player)
        //checkCollision by default are set to true.
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
        this.physics.world.setBounds( 0, 0, Phaser.width, Phaser.height )
        //camera logic
        this.cameras.main.startFollow(this.player)
        //set the horizontal dead zone to 1.5x game width
        this.cameras.main.setDeadzone(Phaser.width * 1.5)

        //---------star--------

        //const star = new Carrot(this, 240, 320, 'star');
        //add a physics group and pass in a config object for star
        //the physics group will create Phaser.Physics.Arcade.Sprite by default. calltype will override that.
        this.star = this.physics.add.group({
            classType: Star
        })
        //test star
        //this.star.get(240, 320, 'star')

        this.physics.add.collider(this.platforms, this.star)

        //star collections
        //add an overlap, testing for a overlap between two objects
        //when an overlap occurs it will call a method.
        this.physics.add.overlap (
            this.player,
            this.star,
            this.handleCollectStar, //called on overlap
            //argument is for the process callback that we don't need.
            undefined,
            //passed on as the context.
            this
        )
        //text(x-axis, y-axis, intial text, argument for styles)
        const style = {color: '#000', fontSize: 24}
        // Phaser.starCollectedText = 
        scoreText = this.add.text(240, 10, this.starCollectedText, style)
            //stop from scrolling off screen
            .setScrollFactor(0)
            //keep the text top centered. Also called a anchor or pivot point
            .setOrigin(0.5, 0)
            
    }

    //code that gets called every frame. refered to as the 'update loop'.
    update() {
        //find out if the object's physics body is touching somthing below it.
        //store it in a variable.
        const touchingDown = this.player.body.touching.down
        
        if (touchingDown) {
            //make bunny jump
            this.player.setVelocityY(-350)

            //switch to the jump texture
            this.player.setTexture('hero-jump')

            //add audio to the jump
            this.sound.play('jump')
        }
        //get the y velocity by accesing the velocity property of the sprites physics body
        const vy = this.player.body.velocity.y;
        if(vy > 0 && this.player.texture.key != 'hero-idle') {
            //switch back to jump when falling
            this.player.setTexture('hero-idle')
        }

        //recycle logic
        //iterate ove the 'child' of the parent
        // says if a platfrom leaves the view of the camera its moved to the top and randomly placed
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;
            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 150)
                platform.body.updateFromGameObject();
                //add a Star above new platforms
                this.addStarAbove(platform)
            }
        })
        this.star.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const star = child;
            const scrollY = this.cameras.main.scrollY;
            if (star.y >= scrollY + 700) {
                //hide the object 
            this.star.killAndHide(this.star);
            //disable from physics world
            this.physics.world.disableBody(star.body)
            }

        })

        //player input logic
        if(this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        }else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)
        }else {
            //stop the movement if not left or right
            this.player.setVelocityX(0)
        }
        if(this.cursors.down.isDown) {
            console.log('restart')
            this.scene.restart(Game);
        }
        if(!this.input.activePointer.isDown && isClicking == true) {
            plane.y = this.input.activePointer.position.y;
            isClicking = false;
        } else if(this.input.activePointer.isDown && isClicking == false) {
            isClicking = true;
        }
        if(Math.abs(plane.y - plane.getData("positionY")) <= 10) {
            plane.y = plane.getData("positionY");
        } else if(plane.y < plane.getData("positionY")) {
            plane.y += 5;
        } else if(plane.y > plane.getData("positionY")) {
            plane.y -= 5;
        }
        
        
        

        const bottomPlatform = this.findBottomMostPlatform();
        //check if the player is past the bottom object
        if(this.player.y > bottomPlatform.y + 200) {
            gameOver = true
            this.add.text(240, 10, 'Game Over', { fontSize: '65px', fill: '#d40000', fontFamily: 'Georgia' });
            this.endGame()
        }
        

    }

    //tells the program that if more then half the width of your sprite goes off the side of the screen, sned it to the other side.
        /** 
         * @param {Phaser.GameObjects.Sprite} sprite
        */
     horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5;
        const gameWidth = Phaser.width;
        if(sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth;
        }else if(sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth;
        }
    }

        /**
         * @param {Phaser.GameObjects.Sprite} sprite
         */
        addStarAbove(sprite) {
            //more accurate formula for positioning a sprite on another object is to subtract half of sprite.displayheight and half of the other objects displayheight from sprite.y.
            const y = sprite.y - sprite.displayHeight;

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const star = this.star.get(sprite.x, y, 'star').setScale(0.8)

            //set active and visible
            star.setActive(true)
            star.setVisible(true)

            this.add.existing(star);
            //update the physics body size
            star.body.setSize(star.width, star.height)
            //make sure body is enabled in the physics world
            this.physics.world.enable(star)

            return star;
        }

        /**
         *  @param {Phaser.Physics.Arcade.Sprite} player
         *  @param {Star} star
         */
        handleCollectStar(player, star) {
            //hide the object 
            this.star.killAndHide(star);
            //disable from physics world
            this.physics.world.disableBody(star.body)
            //increment your score per star
            this.starCollected ++
            //create new text value and set it
            const value = `Star: ${this.starCollected}`
            // console.log(starCollectedText)
            scoreText.setText(value)
            
        }
        //algo for finding the bottom most object
        findBottomMostPlatform() {
            //getting all platforms as an array
            const platforms = this.platforms.getChildren()
            //pick the first one in the array as the current bottom most platform
            let bottomPlatform = platforms[0]
            //iterate over the Array and compare each platform against the current bottomPlatform. If a platform's y position is greater then the bottom then we set it as the new bottom
            for(let i = 1; i < platforms.length; i++) {
                const platform = platforms[i];
                //discard any platforms that are above current
                if(platform.y < bottomPlatform.y) {
                    continue
                }
                bottomPlatform = platform;
            }
            return bottomPlatform;
        }

        endGame() { 
            if (gameOver === true)   {
                // console.log(this.starCollected)
                const newScore = {
                        score: this.starCollected
                }   
        
                const sendScore = (post) => {
                    fetch('/api/game2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                    body: JSON.stringify(post),
                    })
                    .then(() =>{})
                    .catch((err) => console.error(err));
                };
                        
                
                sendScore(newScore)
                this.scene.restart(Game);
                return;
            }
        }

        
}
