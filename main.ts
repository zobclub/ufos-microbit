//  UFO Super Shooting for micro:bit

const ufos = [[0, 0, 255, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0],
[0, 0, 255, 255, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0],
[0, 255, 255, 255, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0],
[0, 0, 255, 255, 0,
    0, 0, 255, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0],
[0, 0, 255, 255, 0,
    0, 0, 255, 255, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0],
[0, 255, 255, 255, 0,
    0, 0, 255, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0],
[0, 255, 255, 255, 0,
    0, 255, 255, 255, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0]
];

const exps = [[0, 0, 0, 0, 0,
    0, 0, 255, 0, 0,
    0, 255, 0, 255, 0,
    0, 0, 255, 0, 0,
    0, 0, 0, 0, 0],
[0, 0, 0, 0, 0,
    0, 255, 255, 255, 0,
    0, 255, 0, 255, 0,
    0, 255, 255, 255, 0,
    0, 0, 0, 0, 0],
[255, 255, 255, 255, 255,
    255, 0, 0, 0, 255,
    255, 0, 0, 0, 255,
    255, 0, 0, 0, 255,
    255, 255, 255, 255, 255]
];


let movingRight = true;
let moveCount = 0;
let game_go = false;
let BULLET_SPEED = 150;
let PLAYER_SPEED = 50;
let UFO_SPEED = 750;
let level = 0;
let score = 0;

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Image {
    im: number[];
    constructor() {
        this.im = [0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0];
    }
    getPixelValue(x: number, y: number): number {
        return this.im[y * 5 + x];
    }
    setPixelValue(x: number, y: number, d: number) {
        this.im[y * 5 + x] = d;
    }
    paste() {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                led.plotBrightness(x, y, this.im[y * 5 + x]);
            }

        }
    }
    shiftLeft() {
        for (let x = 0; x <= 3; x++) {
            for (let y = 0; y < 5; y++) {
                this.im[y * 5 + x] = this.im[y * 5 + x + 1];
            }
        }
        for (let y = 0; y < 5; y++) {

            this.im[y * 5 + 4] = 0;
        }
    }
    shiftRight() {
        for (let x = 3; x >= 0; x--) {
            for (let y = 0; y < 5; y++) {
                this.im[y * 5 + x + 1] = this.im[y * 5 + x];
            }
        }
        for (let y = 0; y < 5; y++) {
            this.im[y * 5] = 0;
        }
    }
    shiftDown() {
        for (let y = 3; y >= 0; y--) {
            for (let x = 0; x < 5; x++) {
                this.im[y * 5 + x + 5] = this.im[y * 5 + x];
            }
        }
        for (let x = 0; x < 5; x++) {
            this.im[x] = 0;
        }
    }
    set(d: number[]) {
        for (let i = 0; i < 25; i++) {
            this.im[i] = d[i];
        }
    }
    cls() {
        for (let i = 0; i < 25; i++) {
            this.im[i] = 0;
        }
    }
    fill() {
        for (let i = 0; i < 25; i++) {
            this.im[i] = 255;
        }
    }
}

input.onButtonPressed(Button.A, function () {
    if (bullet.y == -1) {
        bullet.x = player.x;
        bullet.y = 3;
    }
})

control.inBackground(function () {
    while (game_go) {
        basic.pause(PLAYER_SPEED);
        let ax = input.acceleration(Dimension.X);
        if (ax < -300 && player.x > 0) {
            player.x--;
        } else if (ax > 300 && player.x < 4) {
            player.x++;
        }
    }
})

control.inBackground(function () {
    while (game_go) {
        if (bullet.y != -1) {
            bullet.y--;
            if (ufoi.getPixelValue(bullet.x, bullet.y) > 0) {
                score++;
                ufoi.setPixelValue(bullet.x, bullet.y, 0);
                bullet.y = -1;
            }
        }
        basic.pause(BULLET_SPEED);
    }
})

control.inBackground(function () {
    while (game_go) {
        basic.pause(UFO_SPEED);
        moveCount += 1;
        if (moveCount < 6) {
            if (Math.randomRange(0, 4) == 1) {
                movingRight = !(movingRight);
            }
            if (movingRight) {
                if (ufoInColumn(4)) {
                    movingRight = false;
                } else {
                    ufoi.shiftRight();
                }
            } else {
                if (ufoInColumn(0)) {
                    movingRight = true;
                } else {
                    ufoi.shiftLeft();
                }
            }
        } else {
        if (ufoInRow(3)) {
                game_go = false;
            }
            ufoi.shiftDown();
            moveCount = 0;
        }
    }
})

function ufoCount(): number {
    let count = 0;
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (ufoi.getPixelValue(x, y)) {
                count++;
            }
        }
    }
    return count;
}

function ufoInColumn(x: number): boolean {
    for (let y = 0; y < 5; y++) {
        if (ufoi.getPixelValue(x, y)) {
            return true;
        }
    }
    return false;
}

function ufoInRow(y: number): boolean {
    for (let x = 0; x < 5; x++) {
        if (ufoi.getPixelValue(x, y)) {
            return true;
        }
    }
    return false;
}

function explosion() {
    basic.pause(80);
    expi.set(exps[0]);
    expi.paste();
    basic.pause(80);
    expi.set(exps[1]);
    expi.paste();
    basic.pause(80);
    expi.set(exps[2]);
    expi.paste();
    basic.pause(100);
    expi.cls();
    expi.paste();
    basic.pause(100);
}

function ufoGo() {
    ufoi.set(ufos[level]);
    while (game_go) {
        if (ufoCount() == 0) {
            explosion();
            level += 1;
            if (level == 7) {
                game_go = false;
                return;
            }
            ufoi.set(ufos[level]);
        }
        ufoi.paste();
        led.plotBrightness(player.x, player.y, 255);
        if (bullet.y != -1) {
            led.plotBrightness(bullet.x, bullet.y, 255);
        }
        basic.pause(10);
    }
}

function gameOver() {
    if (level < 7) {
        explosion();
    }
    basic.pause(100);
    expi.fill();
    expi.paste();
    basic.pause(200);
    if (score == 23) {
        basic.showString("Perfest!:");
    } else {
        basic.showString("GAME OVER:");
    }
    basic.showNumber(score);
}

// main routine
let player = new Point(2, 4);
let bullet = new Point(-1, -1);
let ufoi = new Image();
let expi = new Image();

game_go = true;
basic.showString("UFO");
ufoGo();
gameOver();
