import Vector2 from './vector2'
import EventsBehaviour from './eventsBehaviour'
import {lerp} from './mathHelper'
import drawMap from './map/drawMapa'

function clamp(val, min, max) {
    let result = val

    if(val < min)
        result = min
    if(val > max)
        result = max

    return result
}

export default class EngineBehaviour extends EventsBehaviour {
    constructor(ctx) {
        super()
        this.ctx = ctx
        this.width = ctx.canvas.width
        this.height = ctx.canvas.height

        this._camPos = new Vector2(0, 0)
        this.camPos = this._camPos
        this.limits = new Vector2(0,0)

        this.initInputs(this.ctx.canvas)

        this.zoom = 1
        this._zoom= this.zoom
        this.maxZoom = 10
        this.minZoom = 1

        this.firstRender = false
    }

    render() {
        this.update()
        this.draw()
    }

    update() {

    }

    draw() {
        if(!this.needUpdate()) {
            if(!this.firstRender) this.firstRender = true
            else return
        }

        const ctx = this.ctx
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        this._zoom = lerp(this._zoom, this.zoom, 0.3)
        this._camPos = Vector2.lerp(this._camPos, this.camPos, 0.3)

        ctx.setTransform(this._zoom, 0, 0, this._zoom, 0, 0)

        // Draw here down
        drawMap(this)
   }

    onMouseDrag(_pos, speedDir) {
        const {x: sx, y: sy} = speedDir

        this.camPos.x += sx
        this.camPos.y += sy
        this.zoom = this._zoom

        this.normalizeCamPosition()
    }

    onMouseScroll(pos, deltaY) {
        const isUp = deltaY > 0
        const plusZoom = isUp ? 0.9 : 1.1

        const cWidth = this.width / this.zoom
        const cHeight = this.height / this.zoom

        const relativePos = new Vector2(pos.x / this.width, pos.y / this.height)
        relativePos.x = relativePos.x * cWidth + Math.abs(this.camPos.x) / this.zoom
        relativePos.y = relativePos.y * cHeight + Math.abs(this.camPos.y) / this.zoom

        const lastZoom = this.zoom
        this.zoom *= plusZoom
        this.zoom = clamp(this.zoom, this.minZoom, this.maxZoom)

        const dif = this.zoom - lastZoom

        this.camPos.x -= relativePos.x * dif
        this.camPos.y -= relativePos.y * dif

        this.normalizeCamPosition()
    }

    onKeyDown(key) {
        if(key === " ") this.printState()
    }

    normalizeCamPosition() {
        this.camPos.x = clamp(this.camPos.x, (this.width * this.zoom - this.width) * -1, this.limits.x * this.zoom)
        this.camPos.y = clamp(this.camPos.y, (this.height * this.zoom - this.height) * -1, this.limits.y * this.zoom)
    }

    needUpdate() {
        if(this._zoom === this.zoom && this.camPos.x === this._camPos.x && this.camPos.y === this._camPos.y)
            return false

        return true
    }

    printState() {
        let state
        state += `zoom: ${this.zoom.toFixed(2)}\n`
        state += `position: (${this.camPos.x / this.zoom}, ${this.camPos.y.toFixed(2)})\n`
        alert(state)
    }

    dispose() {
        this.clearInputs()
    }
}
