import Vector2 from './vector2'

function getMousePos(e) {
    if (!e) return 0
    return new Vector2(e.offsetX, e.offsetY)
}

export default class EventsBehaviours {

    constructor() {
        this.isDrag = false
    }

    initInputs(element) {
        this.fomm = this._onmousemove.bind(this)
        this.foms = this._onmousescroll.bind(this)
        this.fok = this._onkeydown.bind(this)
        element.addEventListener('mousemove', this.fomm)
        element.addEventListener('wheel', this.foms, { passive: true })
        window.addEventListener('keydown', this.fok)
        this.element = element
    }

    _onmousemove(e) {
        const mousePos = getMousePos(e)
        this.onMouseMove(e)
        this.isDrag = e.buttons === 1
        if (this.isDrag) {
            this.onMouseDrag(mousePos, new Vector2(e.movementX, e.movementY))
        }
    }

    _onmousescroll(e) {
        const mousePos = getMousePos(e)
        this.onMouseScroll(mousePos, e.deltaY)
    }

    _onkeydown(e){
        this.onKeyDown(e.key)
    }

    onMouseMove(e) {}
    onMouseDrag(pos, speedDir) {}
    onMouseScroll(pos, deltaY) {}
    onKeyDown(key) {}

    clearInputs() {
        this.element.removeEventListener('mousemove', this.fomm)
        this.element.removeEventListener('wheel', this.foms)
        window.removeEventListener('keydown', this.fok)
    }
}


