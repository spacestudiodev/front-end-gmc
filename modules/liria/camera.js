import Liria from "."
import Component from "./component"
import Input from "./Input"
import Vector2 from "./vector2"

export default class Camera extends Component {
    init() {
        this.liria = Liria.get()
        this.lastScroll = 0

        Input.onKeyDown(this.alertInfo.bind(this))
        Input.onMouseScroll(this.onMouseScroll.bind(this))
        Input.onMouseMove(this.onMouseMove.bind(this))
    }

    onMouseScroll() {
        const mDeltaY = Input.mouseScrollDelta.y
        const deltaY = mDeltaY < 0 ? 1.1 : 0.9

        const pos = Input.mousePosition
        const worldPos = this.liria.worldPosition

        const width = this.liria.canvas.width
        const height = this.liria.canvas.height

        const cWidth = width / this.liria.worldZoom
        const cHeight = height / this.liria.worldZoom

        const relativePos = new Vector2(pos.x / width, pos.y / height)
        relativePos.x = relativePos.x * cWidth + Math.abs(worldPos.x) / this.liria.worldZoom
        relativePos.y = relativePos.y * cHeight + Math.abs(worldPos.y) / this.liria.worldZoom

        const lastZoom = this.zoom
        this.liria.worldZoom *= deltaY

        //this.zoom = clamp(this.zoom, this.minZoom, this.maxZoom)

        const dif = this.liria.worldZoom - lastZoom

        this.camPos.x -= relativePos.x * dif
        this.camPos.y -= relativePos.y * dif

    }

    onMouseMove() {
        if(!Input.isClicking) return

        this.liria.worldPosition.x += Input.mouseMovDelta.x 
        this.liria.worldPosition.y += Input.mouseMovDelta.y
    }

    alertInfo(e) {
        if(e.key === " ")
           console.log(this.liria.worldPosition)
    }
}
