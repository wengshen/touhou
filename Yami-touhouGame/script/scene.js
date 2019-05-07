//场景
class Scene {
    constructor(game) {
        this.game = game
    }
}
//主场景
class MainScene extends Scene {
    constructor(game) {
        super(game)
        this.setup()

        play('bgm')
    }

    setup() {
        var self = this
        //玩家血量bar
        this.HPBar = document.querySelector("#HP")
        //玩家血量
        this.HPNum = document.querySelector("#HPNum")
        //玩家法力值bar
        this.MPBar = document.querySelector("#MP")
        //玩家法力值
        this.MPNum = document.querySelector("#MPNum")
        //玩家的子弹
        this.selfBullet = []
        //敌人子弹
        this.enemyBullet = []
        //敌人众
        this.animals = []
        //玩家
        this.player = new Player(this.game, this.selfBullet)
        //绑定按键
        this.game.register_action('a', function () {
            self.player.moveLeft()
        })
        this.game.register_action('d', function () {
            self.player.moveRight()
        })
        this.game.register_action('w', function () {
            self.player.moveUP()
        })
        this.game.register_action('s', function () {
            self.player.moveDown()
        })
        this.game.register_action(' ', function () {
            self.player.boom()
        })
        // this.game.register_action('mouse', function () {
        //     self.player.fire(self.game.cursorX, self.game.cursorY)
        // })
    }

    /**
     * 往场景上画当前帧的所有东西
     */
    draw() {
        for (var animal of this.animals) {
            animal.draw()
        }
        for (var bullet of this.selfBullet) {
            bullet.draw()
        }
        for (var bullet of this.enemyBullet) {
            bullet.draw()
        }
        this.player.draw()
    }
    /*
        更新场景，不要问为什么不用update，因为关键词，容易出现意想不到的异常
     */
    updata() {
        //添加敌人，游戏时间整数倍数并且敌人小等于一定数量时触发
        if (this.game.clock % 15 === 0 && this.animals.length <= 10) {
            this.animals.push(new Enemy(this.game, this.enemyBullet, randint(0, totalWidth - images['animal'].width), 0, randint(1, 5)))
        }
        //更新角色
        this.player.updata()
        //处理敌人
        for (var i = 0; i < this.animals.length; i++) {
            this.animals[i].updata()
            for (var j = 0; j < this.selfBullet.length; j++) {
                var bullet = this.selfBullet[j]
                if (collision(this.animals[i], bullet)) {
                    this.animals[i].HP--
                    this.selfBullet.splice(j, 1)
                    j--
                }
            }

            if (this.animals[i].HP < 0 || this.animals[i].y === totalHeight - this.animals[i].height/2) {
                if (this.animals[i].HP < 0)
                    play('boom')
                this.animals.splice(i, 1)
                i--
            }
        }
        //处理自己的子弹
        for (var i = 0; i < this.selfBullet.length; i++) {
            var bullet = this.selfBullet[i]
            bullet.updata()
            if (bullet.x < 0 || bullet.y < 0 || bullet.x > totalWidth || bullet.y > totalHeight) {
                this.selfBullet.splice(i, 1)
                i--
            }
        }
        //处理敌人子弹
        for (var i = 0; i < this.enemyBullet.length; i++) {
            var bullet = this.enemyBullet[i]
            bullet.updata()
            var flag = false
            if (collision(this.player, bullet)) {
                if (this.player.clock_inv === 0) {
                    this.player.HP--
                    flag = true
                    this.player.clock_inv = this.player.invincible
                }
            }
            if (flag || bullet.x < 0 || bullet.y < 0 || bullet.x > totalWidth || bullet.y > totalHeight) {
                this.enemyBullet.splice(i, 1)
                i--
            }
        }
        //处理bar的状态
        this.HPBar.style.width = 500 * (this.player.HP/this.player.totalHP) + "px"
        this.MPBar.style.width = 500 * (this.player.MP/this.player.totalMP) + "px"
        // this.HPNum.textContent = "HP: " + this.player.HP
        // this.MPNum.textContent = "MP: " + this.player.MP

        this.draw()
    }
}