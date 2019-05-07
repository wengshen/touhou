var totalWidth = 1300
var totalHeight = 700
var log = console.log.bind(console)

class Game {
    constructor() {
        //绑定canvas
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        //当前的keys按键
        this.keys = {}
        //keys对应的动作(回调函数执行)
        this.actions = {}
        //游戏时间计数
        this.clock = 0
        //初始设置
        this.setup()
        //加载场景
        this.scene = new MainScene(this)
    }

    /**
     * 目前这步就绑定按键，和按键回调
     */
    setup() {
        var self = this

        totalHeight = this.canvas.height
        totalWidth = this.canvas.width

        window.addEventListener('keydown', function (event) {
            self.keys[event.key] = true
        })
        window.addEventListener('keyup', function (event) {
            self.keys[event.key] = false
        })
        this.canvas.addEventListener('mousedown', function () {
            self.keys['mouse'] = true
        })
        this.canvas.addEventListener('mouseup', function () {
            self.keys['mouse'] = false
        })

        document.onmousemove = function (e) {
            self.cursorX = e.pageX
            self.cursorY = e.pageY
        }
    }

    register_action(key, callback) {
        this.actions[key] = callback
    }

    run() {
        var self = this

        setInterval(function () {
            self.clock++
            //响应当前玩家操作
            var actions = Object.keys(self.actions)
            for (var x of actions) {
                if (self.keys[x]) self.actions[x]()
            }
            //更新场景数据
            self.scene.updata()
            //清空
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)
            //重绘场景
            self.scene.draw()

        }, 1000 / 60) //1秒切分60帧
    }

}
//main函数
function __main__() {
    loadSource()
    var game = new Game()
    game.run()
}
//执行main函数
__main__()
