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
        element.addEventListener('mousemove', this._onmousemove.bind(this))
        element.addEventListener('wheel', this._onmousescroll.bind(this))
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

    onMouseMove(e) {}
    onMouseDrag(pos, speedDir) {}
    onMouseScroll(pos, deltaY) {}

    clearInputs() {
        this.element.removeEventListener('mousemove', this._onmousemove.bind(this))
        this.element.addEventListener('wheel', this._onmousescroll.bind(this))
    }
}


