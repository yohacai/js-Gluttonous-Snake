const LEFT = 37
const RIGHT = 39
const UP = 38
const DOWN = 40

class Snake {
    constructor() {
        this.direction = RIGHT
        this.length = 6
        this.body = []
        this.dirtyDirection = false

        this.initSnake()
    }
    initSnake() {
        for (let i = 0; i < this.length; i++) {
            this.body.push([0, i])
        }
    }
    move() {
        const head = this.body[this.length - 1]
        this.body.shift()
        switch (this.direction) {
            case LEFT:
                this.body.push([head[0], head[1] - 1]);
                break;
            case RIGHT:
                this.body.push([head[0], head[1] + 1]);
                break;
            case UP:
                this.body.push([head[0] - 1, head[1]]);
                break;
            case DOWN:
                this.body.push([head[0] + 1, head[1]]);
                break;
        }
        this.dirtyDirection = false
    }
    grow() {
        const tail = this.body[0]
        const tailNext = this.body[1]
        let newTail 
        newTail = [ 2 * tail[0] - tailNext[0] , 2 * tail[1] - tailNext[1]]
        this.length++
        this.body.unshift(newTail)
        return newTail
    }
    changeDirection(direction) {
        if (this.dirtyDirection)
            return
        if (Math.abs(this.direction - direction) == 2 || (this.direction == direction))
            return
        this.direction = direction
        this.dirtyDirection = true
    }
}

class Game {
    constructor(options) {
        this.foodPosition = []
        this.graph = null
        this.snake = null
        this.timeFlag = null
        this.options = options
        this.initConfig = {
            graphSize: 500,
            rectSize: 6,
            scale: 62,
            speed: 1,
            foodCount: 4
        }
        this.init(options)
    }
    _calculatePosition(item) {
        return item[0] * (this.config.scale) + item[1]
    }
    init(options) {
        this._initConfig(options)
        this._initGraph()
        this._initFood()
        this.snake = new Snake()
        this._drawSnake()
        this._initEvent()
    }
    _initConfig(options) {
        this.config = Object.assign({}, this.initConfig, options)
        const scale = parseInt(this.config.graphSize / this.config.rectSize)
        const fixedGraph = scale * this.config.rectSize
        this.config.graphSize = fixedGraph
        this.config.scale = scale
    }
    _initGraph() {
        var appEl = document.getElementById('app')
        if (this.graph)
            appEl.removeChild(this.graph)
        appEl.style.width = appEl.style.height = this.config.graphSize + 'px'
        var wrapper = document.createElement('div')
        wrapper.setAttribute('tabindex', '-1')
        var rectCount = this.config.scale * this.config.scale
        for (var i = 0; i < rectCount; i++) {
            var span = document.createElement('span')
            span.setAttribute('class', 'rect')
            span.style.height = span.style.width = this.config.rectSize + 'px'
            wrapper.appendChild(span)
        }
        this.graph = wrapper
        appEl.appendChild(wrapper)
    }
    _initEvent() {
        this.graph.addEventListener('keydown', (e) => {
            var keyCode = e.keyCode
            this.snake.changeDirection(keyCode)
        })
        this.graph.focus()
    }
    _initFood(){
        for (let i = 0; i < this.config.foodCount; i++) {
            this._produceFood()
        }
    }
    _drawSnake() {
        const body = this.snake.body
        body.map(item => {
            const position = this._calculatePosition(item)
            this.graph.childNodes[position].classList.add('snackBody')
        })
    }
    _updateGraph() {
        const tail = this.snake.body[0]
        const tailPosition = this._calculatePosition(tail)
        this.snake.move()

        const head = this.snake.body[this.snake.length - 1]
        const headPosition = this._calculatePosition(head)
        if (head[0] > (this.config.scale - 1) || head[1] > (this.config.scale - 1) || head[0] < 0 || head[1] < 0) {
            this.stop()
            return
        }

        this.graph.childNodes[tailPosition].classList.remove('snackBody')

        if (this.graph.childNodes[headPosition].classList.contains('snackBody')) {
            this.stop()
            return
        }

        this.graph.childNodes[headPosition].classList.add('snackBody')
        if (this.graph.childNodes[headPosition].classList.contains('food')) {
            this.graph.childNodes[headPosition].classList.remove('food')
            const newTail = this.snake.grow()
            this.graph.childNodes[this._calculatePosition(newTail)].classList.add('snackBody')
            this._produceFood()
        }

        this.timeFlag = setTimeout(() => this._updateGraph(), 220 - this.config.speed * 20)
    }
    _produceFood() {
        const newPosition = [Math.floor(Math.random() * this.config.scale), Math.floor(Math.random() * this.config.scale)]
        const target = this.graph.childNodes[this._calculatePosition(newPosition)]
        if (target.classList.contains('snakeBody') || target.classList.contains('food')) {
            this.produceFood()
            return
        }
        this.foodPosition = newPosition
        const position = this.foodPosition[0] * (this.config.scale) + this.foodPosition[1]
        const food = this.graph.childNodes[position]
        food.classList.add('food')
    }
    adjustSpeed(operation) {
        this.graph.focus()
        if (operation > 0) {
            if (this.config.speed == 9)
                return
        } else {
            if (this.config.speed == 1)
                return
        }
        this.config.speed += operation
    }
    stop() {
        clearTimeout(this.timeFlag)
        alert('Game Over!')
    }
    start() {
        this._updateGraph()
        this.graph.focus()
    }
    restart() {
        clearTimeout(this.timeFlag)
        this.init(this.options)
        this.start()
    }
}

export default Game
