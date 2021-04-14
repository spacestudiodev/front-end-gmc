import Liria from "."
import Component from "./component"
import Vector2 from "./vector2"

export default class Input extends Component {
    static mousePosition = new Vector2()
    static mouseMovDelta = new Vector2()
    static isClicking = false
    static mouseScrollDelta = new Vector2()

    static get() {
        const sing = Input.main
        
        if(!sing)
            console.error("No se ha iniciado el componente << Input >>")

        return sing
    }

    static set(target){
        this.main = target
    }

    static onKeyDown(func) {
        const sing = Input.get()
        sing?._eokdown.push(func)
    }

    static onKeyUp(func) {
        const sing = Input.get()
        sing?._eokup.push(func)
    }

    static onMouseMove(func){
        const input = Input.get()
        input?._eommove.push(func)
    }

    static onMouseScroll(func) {
        const input = Input.get()
        input?._eomscroll.push(func)
    }

    init() {
        Input.set(this)

        this._eokdown = []
        this._eokup = []
        this._eommove = []
        this._eomscroll = []

        this.canvas = Liria.get().canvas

        this.fokd = this._onkeydown.bind(this)
        this.foku = this._onkeyup.bind(this)
        this.fomm = this._onmousemove.bind(this)
        this.foms = this._onmousescroll.bind(this)
        
        window.addEventListener("keydown", this.fokd)
        window.addEventListener("keyup", this.foku)

        this.canvas.addEventListener('wheel', this.foms, { passive: true })
        this.canvas.addEventListener("mousemove", this.fomm)

        Input.mousePosition = new Vector2()
        Input.mouseMovDelta = new Vector2()
    }

    _onkeydown(e) {
        for (let eok of this._eokdown)
            eok(e)
    }

    _onkeyup(e) {
        for (let eok of this._eokup)
            eok(e)
    }

    _onmousemove(e) {
        Input.mousePosition = new Vector2(e.offsetX, e.offsetY)
        Input.mouseMovDelta = new Vector2(e.movementX, e.movementY)
        Input.isClicking = e.buttons === 1

        for (let func of this._eommove)
            func()
    }

    _onmousescroll(e) {
        Input.mouseScrollDelta.x = e.deltaX
        Input.mouseScrollDelta.y = e.deltaY
        Input.mousePosition = new Vector2(e.offsetX, e.offsetY)

        for (let func of this._eomscroll)
            func()
    }

    destroy() {
        window.removeEventListener("keydown", this.fokd)
        window.removeEventListener("keyup", this.foku)

        this.canvas.removeEventListener("mousemove", this.fomm)
        this.canvas.removeEventListener("wheel", this.foms)
    }
}
