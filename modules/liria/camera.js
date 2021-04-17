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
        const deltaY = mDeltaY < 0 ? 1.5 : -1.5

        const pos = Input.mousePosition
        const relativePos = this.liria.screenToWorldPos(pos)

        const lastZoom = this.liria.worldZoom
        
        this.liria.zPos += deltaY
        const nextZoom= Math.pow(1.1, this.liria.zPos)

        console.log(this.liria.zPos / 6 + 14.25)

        this.liria.worldZoom = nextZoom
        const dif = this.liria.worldZoom - lastZoom

        this.liria.cameraPosition.x -= relativePos.x * dif
        this.liria.cameraPosition.y -= relativePos.y * dif
    }

    onMouseMove() {
        if(!Input.isClicking) return

        this.liria.cameraPosition.x += Input.mouseMovDelta.x 
        this.liria.cameraPosition.y += Input.mouseMovDelta.y
    }

    alertInfo(e) {
        if(e.key === " ")
           console.log(this.liria.cameraPosition)
    }
}
