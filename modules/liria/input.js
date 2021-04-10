import { Component, Vector2 } from ".";

export default class Input extends Component {
    static get() {
        const sing = Input.main
        
        if(!sing)
            console.error("No se ha iniciado el componente << Input >>")

        return sing
    }

    static set(target){
        this.main = target
    }

    static addGetKeyDown(func) {
        const sing = Input.get()
        sing?._iokdown.push(func)
    }

    static addGetKeyUp(func) {
        const sing = Input.get()
        sing?._iokup.push(func)
    }

    init() {
        this.set(this)

        this._iokdown = []
        this._iokup = []

        this.fokd = this._onkeydown.bind(this)
        this.foku = this._onkeyup.bind(this)
        this.fomm = this._onmousemove.bind(this)
        
        window.addEventListener("keydown", this.fokd)
        window.addEventListener("keyup", this.foku)

        //this.canvas.addEventListener("mousemove", this.fomm)

        Input.mousePosition = new Vector2()
        Input.mouseDelta = new Vector2()
    }

    _onkeydown(e) {
        for (let iok of this.iokdown)
            iok(e)
    }

    _onkeyup(e) {
        for (let iok of this.iokup)
            iok(e)
    }

    _onmousemove(e) {
        Input.mousePosition.x = e.offsetX
        Input.mousePosition.y = e.offsetY
        Input.mouseDelta.x = e.movementX
        Input.mouseDelta.y = e.movementY
    }

    destroy() {
        window.removeEventListener("keydown", this.fokd)
        window.removeEventListener("keyup", this.foku)

        //this.canvas.removeEventListener("mousemove", this.fomm)
    }
}
