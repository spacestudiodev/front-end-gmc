import Vector2 from './vector2'
import EventsBehaviour from './eventsBehaviour'

function clamp(a, b, c) {
    let result = a

    if(a < b)
        result = b
    if(a > c)
        result = c

    return result
}

export default class EngineBehaviour extends EventsBehaviour {
    constructor(ctx) {
        super()
        this.ctx = ctx
        this.width = ctx.canvas.width
        this.height = ctx.canvas.height

        this.camPos = new Vector2(0, 0)
        this.initInputs(this.ctx.canvas)

        this.positions = []
        for(var i = 0; i < 1; i++){
            this.positions[i] = new Vector2(Math.random() * 1000, Math.random() * 1000)
        }
        this.zoom = 1
    }

    render() {
        this.update()
        this.draw()
    }

    update() {

    }

    draw() {
        const ctx = this.ctx
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.setTransform(this.zoom, 0, 0, this.zoom, this.camPos.x, this.camPos.y)

        for(var i = 0; i < this.positions.length; i++) {
            ctx.fillRect(this.positions[i].x, this.positions[i].y, 30, 30)
        }
    }

    onMouseDrag(pos, speedDir) {
        const {x: sx, y: sy} = speedDir

        this.camPos.x += sx
        this.camPos.y += sy
    }

    onMouseScroll(pos, deltaY){
        const plusZoom = deltaY > 0 ? -.1 : .1
        this.zoom += plusZoom
        const posXzoom = pos.x / this.width
        const posYzoom = pos.y / this.height
        console.log(posXzoom, posYzoom, pos.x, pos.y, this.width, this.height)
        this.camPos.x += posXzoom * plusZoom
        this.camPos.y += posYzoom * plusZoom
    }

    inWord(x, y) {
        const {x: cx, y: cy} = this.camPos
        return new Vector2(x, y)
    }

    dispose() {
        this.clearInputs()
    }
}
