import Liria from "."
import Component from "./component"
import Input from "./Input"

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
        this.liria.worldZoom *= deltaY        
    }

    onMouseMove() {
        if(!Input.isClicking) return

        this.liria.worldPosition.x += Input.mouseMovDelta.x 
        this.liria.worldPosition.y += Input.mouseMovDelta.y
    }

    alertInfo(e) {
        if(e.key === " ")
           console.log(this.liria.worldZoom)
    }
}
