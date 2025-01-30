class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 2)
        //this.cup.body.setOffset(0)
        this.cup.body.setImmovable = true

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)


        //floating wall
        this.wallC = this.physics.add.sprite(0, height / 3, 'wall')
        this.wallC.setX(Phaser.Math.Between(0 + this.wallC.width / 2, width - this.wallC.width / 2))
        this.wallC.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB, this.wallC])
        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            //function callback 
            let yshotDirection = pointer.y <= this.ball.y ? 1 : -1
            let xshotDirection = pointer.x <= this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * xshotDirection)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * yshotDirection)
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup,) => {

            this.ball.setAcceleration(0, 0)
            this.ball.setVelocity(0, 0)
            this.ball.setX(width / 2)
            this.ball.setY(height - height / 10)

            this.ball.setAcceleration(0, 0)
            this.ball.setVelocity(0, 0)
            //ball.destroy()
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
        this.wallDirection = -1
    }

    update() {

        if (this.wallC.x > width) {

            this.wallDirection = -1
        }
        if (this.wallC.x - this.wallC.width / 2 < 0) {
            this.wallDirection = 1

        }
        this.wallC.setX(this.wallC.x += 4 * this.wallDirection)
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[x ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[x ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/