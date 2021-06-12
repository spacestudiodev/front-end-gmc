import Vector2 from "./vector2"

export default class Input {
    static mousePosition = new Vector2()
    static mouseMovDelta = new Vector2()
    static isClicking = false
    static mouseScrollDelta = new Vector2()

    static get() {
        const sing = Input.main

        if (!sing)
            console.error("No se ha iniciado el componente << Input >>")

        return sing
    }

    static set(target) {
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

    static onMouseMove(func) {
        const input = Input.get()
        input?._eommove.push(func)
    }

    static onMouseScroll(func) {
        const input = Input.get()
        input?._eomscroll.push(func)
    }

    static onMouseClick(func) {
        const input = Input.get()
        input?._eomclick.push(func)
    }

    constructor(view) {
        Input.set(this)

        this._eokdown = []
        this._eokup = []
        this._eommove = []
        this._eomscroll = []
        this._eomclick = []

        this.view = view

        this.fokd = this._onkeydown.bind(this)
        this.foku = this._onkeyup.bind(this)
        this.fomm = this._onmousemove.bind(this)
        this.fotm = this._ontouchmove.bind(this)
        this.fote = this._ontouchend.bind(this)
        this.foms = this._onmousescroll.bind(this)
        this.fomd = this._onmousedown.bind(this)
        this.fomu = this.__onmouseup.bind(this)

        window.addEventListener("keydown", this.fokd)
        window.addEventListener("keyup", this.foku)

        this.view.addEventListener('wheel', this.foms, {passive: true})
        this.view.addEventListener("mousemove", this.fomm)
        this.view.addEventListener("touchmove", this.fotm)
        this.view.addEventListener("touchend", this.fote)
        this.view.addEventListener('mousedown', this.fomd)
        this.view.addEventListener('mouseup', this.fomu)

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

    previusTouch
    previusTouch2

    _ontouchmove(e) {
        const touch = e.touches[0]
        const touch2 = e.touches[1]

        if (this.previusTouch) {
            const mdelta = new Vector2(touch.pageX - this.previusTouch.pageX,
                touch.pageY - this.previusTouch.pageY)

            if (this.previusTouch2) {
                const lastp1 = new Vector2(this.previusTouch.pageX, this.previusTouch.pageY)
                const lastp2 = new Vector2(this.previusTouch2.pageX, this.previusTouch2.pageY)
                const lastDistance = Vector2.distance(lastp1, lastp2)

                const p1 = new Vector2(touch.pageX, touch.pageY)
                const p2 = new Vector2(touch2.pageX, touch2.pageY)
                const distance = Vector2.distance(p1, p2)

                const centralPoint = new Vector2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)

                const delta = distance - lastDistance
                Input.mouseScrollDelta.y = delta / 15
                Input.mousePosition = centralPoint

                for (let func of this._eomscroll)
                    func()

            } else {
                Input.mouseMovDelta = mdelta
                Input.isClicking = true

                for (let func of this._eommove)
                    func()
            }

        }

        this.previusTouch = touch
        this.previusTouch2 = touch2
    }

    _ontouchend(e) {
        this.previusTouch = undefined
        Input.isClicking = false
    }

    _onmousemove(e) {
        Input.mousePosition = new Vector2(e.offsetX, e.offsetY)
        Input.mouseMovDelta = new Vector2(e.movementX, e.movementY)
        
        //Input.isClicking = e.buttons === 1

        for (let func of this._eommove)
            func()
    }

    _onmousescroll(e) {
        Input.mouseScrollDelta.x = e.deltaX < 0 ? 1.2 : -1.2
        Input.mouseScrollDelta.y = e.deltaY < 0 ? 1.2 : -1.2

        Input.mousePosition = new Vector2(e.offsetX, e.offsetY)

        for (let func of this._eomscroll)
            func()
    }

    _onmousedown() {
        Input.isClicking = true
        for (let func of this._eomclick)
            func()
    }

    __onmouseup() {
        Input.isClicking = false
    }

    dispose() {
        window.removeEventListener("keydown", this.fokd)
        window.removeEventListener("keyup", this.foku)

        this.view.removeEventListener("mousemove", this.fomm)
        this.view.removeEventListener("wheel", this.foms)
        this.view.removeEventListener("mousedown", this.fomd)
        this.view.removeEventListener("mousemove", this.fomm)
        this.view.removeEventListener("touchmove", this.fotm)
        this.view.removeEventListener("touchend", this.fote)
        this.view.removeEventListener('mouseup', this.fomu)
    }
}
