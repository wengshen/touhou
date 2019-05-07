//表示画布上的物体的通用基类
class Thing {
    /**
     *
     * @param game
     * @param image_name
     * @param physical
     */
    constructor(game, image_name, physical = 1) {
        this.x = 0  //x坐标
        this.y = 0  //y坐标
        this.speed = 10 //速度
        this.image_name = image_name  //图片名
        this.image = images[image_name] //图片对象
        this.height = this.image.height
        this.width = this.image.width
        this.physical = physical
        this.phyWidth = this.image.width * physical
        this.phyHeight = this.image.height * physical
        this.game = game
    }
    //设置图片
    setImage() {
        this.image = images[this.image_name]
        this.width = this.image.width
        this.height = this.image.height
        this.phyWidth = this.image.width * this.physical
        this.phyHeight = this.image.height * this.physical
    }
    //上
    moveUP() {
        this.y -= this.speed
        this.y = Math.max(this.height / 2, this.y)
    }
    //下
    moveDown() {
        this.y += this.speed
        this.y = Math.min(totalHeight - this.height / 2, this.y)
    }
    //左
    moveLeft() {
        this.x -= this.speed
        this.x = Math.max(this.height / 2, this.x)
    }
    //右
    moveRight() {
        this.x += this.speed
        this.x = Math.min(totalWidth - this.width / 2, this.x)
    }

    draw() {
        this.setImage()
        this.game.context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2)
    }
}
//子弹类
class Bullet extends Thing {
    constructor(game, x, y, tx, ty, speed, image_name = 'bullet') {
        super(game, image_name)
        this.x = x  - this.width / 2
        this.y = y
        this.tx = tx  - this.width / 2
        this.ty = ty

        this.speed = speed

        this.width = images[image_name].width
        this.height = images[image_name].height

        var len = Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y))

        this.speedX = this.speed * (this.tx - this.x) / len
        this.speedY = this.speed * (this.ty - this.y) / len
    }

    updata() {
        this.move()
    }

    draw() {
        if (this.image_name === "selfBullet")
            animation(this.game.context, this.x, this.y, 0, this.image_name)
        else
            super.draw()
    }

    move() {
        this.x += this.speedX
        this.y += this.speedY
    }
}
//战斗单位Fighter,目前有玩家player和敌人Enemy
class Fighter extends Thing {
    /**
     *
     * @param game
     * @param x
     * @param y
     * @param speed
     * @param image_name
     * @param bulletImage
     * @param bullets
     * @param physical
     */
    constructor(game, x, y, speed, image_name, bulletImage, bullets, physical = 1) {
        super(game, image_name, physical)
        this.x = x
        this.y = y
        this.speed = speed
        this.bulletImage = bulletImage
        this.bullets = bullets

        this.bulletSpeed = 10
        this.attackSpeed = 5
        this.cd = 10

        this.totalHP = 100
        this.totalMP = 100
        this.HP = 100
        this.MP = 100

        this.clock_as = 0
        this.clock_cd = 0
    }

    updata() {
        this.clock_cd = Math.max(0, this.clock_cd - 1)
        this.clock_as = Math.max(0, this.clock_as - 1)
        this.MP = Math.min(this.totalMP, this.MP + 0.5)
    }

    fire(toX, toY) {
        if (this.clock_as !== 0) return
        // this.MP -= 5

        play('biu')

        this.clock_as = this.attackSpeed
        this.bullets.push(new Bullet(this.game, this.x, this.y - 30, toX, toY, this.bulletSpeed * 2, this.bulletImage))
    }

    /**
     * 简单的放boom弹
     */
    boom() {
        //在内置CD中，或者MP太低，无法释放，
        if (this.clock_cd !== 0 || this.MP <= 20) return
        //消耗法力的计算
        //todo 未来引入法力系统 mark一下
        this.MP -= 20
        //放boom要有音效
        play('biu')

        //设置cd时间为最大
        this.clock_cd = this.cd

        //围绕自己，放一圈子弹
        var r = 1000
        var m = 10

        var space = 2 * Math.PI / 20

        for (var c = 0; c < 2 * Math.PI; c += space) {
            this.bullets.push(new Bullet(this.game, this.x + m * Math.sin(c), this.y + m * Math.cos(c), this.x + r * Math.sin(c), this.x + r * Math.cos(c), this.bulletSpeed, this.bulletImage))
        }
    }
}
//玩家
class Player extends Fighter {
    constructor(game, bullets, x = 250, y = 500, speed = 5, image_name = 'player', bulletImage = 'selfBullet', physical = 0.5) {
        super(game, x, y, speed, image_name, bulletImage, bullets, physical)
        this.invincible = 10
        this.clock_inv = 0
        this.width = 32
        this.height = 47
        this.phyWidth = this.width / 4
        this.phyHeight = this.height / 4
    }

    draw() {
        animation(this.game.context, this.x - this.width / 2, this.y - this.height / 2, (this.game.clock / 8 % 8), 'players')
    }

    /**
     * 更新player图片，偷点懒，只做三种意思下
     */
    updata() {
        super.updata()
        this.fire(this.x, this.y - 100)
        if (this.game.keys['d']) {
            this.image_name = 'right'
        } else if (this.game.keys['a']) {
            this.image_name = 'left'
        } else {
            this.image_name = 'player'
        }
        //计算玩家角色被击冷却时间
        this.clock_inv = Math.max(0, this.clock_inv - 1)
    }
}
//敌人
class Enemy extends Fighter {
    /**
     *
     * @param game 游戏上下文
     * @param bullets  子弹集合
     * @param x   敌人出现的位置x
     * @param y  敌人出现的位置y
     * @param speed   敌人速度
     * @param image_name  敌人id名字
     * @param bulletImage 子弹类型
     */
    constructor(game, bullets, x = 200, y = 100, speed = 5, image_name = 'enemy1', bulletImage = 'bullet') {
        super(game, x, y, speed, image_name, bulletImage, bullets)
        this.HP = randint(1, 5)
        this.speed = speed
        this.bulletSpeed = 2.5
        this.attackSpeed = 100
        this.cd = 1000
        this.setup()
    }
    //取一个随机敌人
    setup() {
        this.image_name = 'enemy' + randint(1, 8)
    }

    updata() {
        super.updata()
        if (this.speed === 3) this.boom()
        this.fire(this.x, this.y + 100)
        this.moveDown()
    }
}