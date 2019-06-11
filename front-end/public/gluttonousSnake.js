
const SNAKE_COLOR = "#50bfff";
const FOOD_COLOR = "#ff4949";
const CELL_X = 20;
const CELL_Y = 20;
const SNAKE_LENGTH_INITIAL = 3;
const LEVEL_PACE = 4; // 增加n长度就升级
const SPEED_INIT = 1000; // 初始速度ms
const SPEED_PACE = 20; // 每关加速ms
const LEVEL_MAX = 45; // 最大关卡

// 方块
function Cell(x, y, c, t) {
    // Position(x,y) Color Text
    this.width = CELL_X;
    this.height = CELL_Y;
    this.color = c || 'white';
    this.x = x || 0;
    this.y = y || 0;
    this.text = t || ""
    this._cell = null;

    this.left = function(){
        return this.x * this.width;
    }
    this.top = function(){
        return this.y * this.height;
    }

    this.clear = function () {
        if (this._cell !== null) {
            this._cell.parentNode.removeChild(this._cell);
            this._cell = null;
        }
    }
    this.show = function (_stage) {
        // 第一次需要先创建元素
        if (this._cell === null) {
            this._cell = document.createElement("div");
            this._cell.style.width = this.width + "px";
            this._cell.style.height = this.height + "px";
            this._cell.style.backgroundColor = this.color;
            this._cell.style.position = "absolute";
            this._cell.style.border = "1px solid grey";
            this._cell.innerHTML = this.text;
            this._cell.style.fontSize = "20px";
            // this._cell.style.fontWeight = "bold";
            this._cell.style.lineHeight = "20px";

            _stage.appendChild(this._cell);
        }
        // 设置元素位置
        this._cell.style.left = this.x * this.width + "px";
        this._cell.style.top = this.y * this.height + "px";
    }
}

// 蛇
function Snake() {
    this.direction = 'horizontal';
    this.pace = 1;
    this.body = [new Cell(3, 0, SNAKE_COLOR), new Cell(2, 0, SNAKE_COLOR), new Cell(1, 0, SNAKE_COLOR)];

    this.init = function () {
        this.clear();
        this.direction = 'horizontal';
        this.pace = 1;
        this.body = [new Cell(3, 0, SNAKE_COLOR), new Cell(2, 0, SNAKE_COLOR), new Cell(1, 0, SNAKE_COLOR)];
    }

    this.clear = function () {
        for (let i = 0; i < this.body.length; i++) {
            this.body[i].clear();
        }
    }

    this.setDirection = function (arrow, _stage) {
        if (this.direction === 'horizontal') {
            switch (arrow) {
                case 38:
                    this.pace = -1; // up
                    this.direction = 'vertical';
                    break;
                case 40:
                    this.pace = 1; // down
                    this.direction = 'vertical';
                    break;
            }
        } else if (this.direction === 'vertical') {
            switch (arrow) {
                case 37:
                    this.pace = -1; // left
                    this.direction = 'horizontal';
                    break;
                case 39:
                    this.pace = 1; // right
                    this.direction = 'horizontal';
                    break;
            }
        }
        // 实现按键加速，并修正原地掉头bug
        this.move(_stage);
    }

    this.show = function (_stage) {
        for (let i = 0; i < this.body.length; i++) {
            this.body[i].show(_stage);
        }
    }

    this.move = function (_stage) {
        let last = this.body.length - 1;
        // 先挪身子
        for (let i = last; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
            this.body[i].show(_stage);
        }
        // 根据方向挪头
        if (this.direction === 'horizontal') {
            this.body[0].x += this.pace;
        } else if (this.direction === 'vertical') {
            this.body[0].y += this.pace;
        }
        this.body[0].show(_stage);
    }
}

// DOM element
let frame = document.createElement("div");
let randId = "frame" + Math.random().toString(32).slice(-10);
frame.id = randId;
document.body.appendChild(frame);
// 游戏逻辑
var snake = new Snake();

var timer; // 蛇蛇移动定时器
var speed = SPEED_INIT; // 速度
var level;

// 游戏开始
function Start() {
    timer || (timer = window.setInterval('snake.move(frame)', speed));
    document.onkeydown = handleKeydown;
}

// 监听方向箭头
function handleKeydown() {
    if (window.event) {
        arrow = window.event.keyCode;
    } else {
        arrow = event.keyCode;
    }
    snake.setDirection(arrow, frame)
}


Start();