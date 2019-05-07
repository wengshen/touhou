var images = {}
var audios = {}

//简单的碰撞检测
function collision(A, B) {
    var l1 = A.x - A.phyWidth / 2
    var r1 = A.x + A.phyWidth / 2

    var l2 = A.y - A.phyHeight / 2
    var r2 = A.y + A.phyHeight / 2

    var l3 = B.x - B.phyWidth / 2
    var r3 = B.x + B.phyWidth / 2

    var l4 = B.y - B.phyHeight / 2
    var r4 = B.y + B.phyHeight / 2

    if (r1 < l3) return false
    if (r3 < l1) return false
    if (r2 < l4) return false
    if (r4 < l2) return false
    return true
}
//动画
function animation(context, posX, posY, num, image_name) {
    num = Math.floor(num)
    var img = images[image_name]
    context.drawImage(img.img, img.sx + img.width * num, img.sy, img.width, img.height, posX, posY, img.width, img.height)
}
//加载图片
function getImage() {
    images['player'] = new Image()
    images['animal'] = new Image()
    images['bullet'] = new Image()
    images['left'] = new Image()
    images['right'] = new Image()

    images['enemy1'] = new Image()
    images['enemy2'] = new Image()
    images['enemy3'] = new Image()
    images['enemy4'] = new Image()
    images['enemy5'] = new Image()
    images['enemy6'] = new Image()
    images['enemy7'] = new Image()

    images['players'] = {
        img: new Image(),
        sx: 0,
        sy: 0,
        width: 32,
        height: 50,
    }

    images['selfBullet'] = {
        img: new Image(),
        sx: 18,
        sy: 113,
        width: 12,
        height: 14,
    }


    images['left'].src = 'source/image/left.png'
    images['right'].src = 'source/image/right.png'
    images['player'].src = 'source/image/player.gif'
    images['animal'].src = 'source/image/animal.png'
    images['bullet'].src = 'source/image/bullet.gif'

    images['enemy1'].src = 'source/image/enemy1.png'
    images['enemy2'].src = 'source/image/enemy2.png'
    images['enemy3'].src = 'source/image/enemy3.png'
    images['enemy4'].src = 'source/image/enemy4.png'
    images['enemy5'].src = 'source/image/enemy5.png'
    images['enemy6'].src = 'source/image/enemy6.png'
    images['enemy7'].src = 'source/image/enemy7.png'

    images['players'].img.src = 'source/image/players.png'
    images['selfBullet'].img.src = 'source/image/bullets.png'
}
//加载bgm
function getMusic() {
    audios['bgm'] = new Audio('source/music/bgm.mp3')
    audios['biu'] = new Audio('source/music/biu.wav')
    audios['boom'] = new Audio('source/music/boom.wav')
    audios['peng'] = new Audio('source/music/peng.wav')
}
//播放音乐
function play(name) {
    var music = audios[name]
    music.currentTime = 0
    music.play()
}
//加载资源
function loadSource() {
    getMusic()
    getImage()
}
//随机l-r的int整数
function randint(l, r) {
    return Math.floor(Math.random() * (r - l)) + l
}