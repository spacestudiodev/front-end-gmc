import Liria from "."
import Component from "./component"
import Input from "./Input"
import {lerp} from "./mathHelper"
import Vector2 from "./vector2"

export default class Camera {
    static main
    
    cameraPosition = new Vector2()
    worldZoom = 1
    zPos = 0

    constructor(container, view) {
        Camera.main = this
        this.nextZoom = 1
        this.lastScroll = 0
        this.cam = container
        this.view = view
        this.speed = 0.2

        //Input.onKeyDown(this.alertInfo.bind(this))
        Input.onMouseScroll(this.onMouseScroll.bind(this))
        Input.onMouseMove(this.onMouseMove.bind(this))
    }

    onMouseScroll() {
        const mDeltaY = Input.mouseScrollDelta.y
        const deltaY = mDeltaY < 0 ? 1.5 : -1.5

        const pos = Input.mousePosition
        const relativePos = this.screenToWorldPos(pos)

        const lastZoom = this.worldZoom
        
        this.zPos += deltaY
        this.worldZoom = Math.pow(1.1, this.zPos)

        const dif = this.worldZoom - lastZoom

        this.cameraPosition.x -= relativePos.x * dif
        this.cameraPosition.y -= relativePos.y * dif
    }

    update() {
        this.updateCamera()
    }

    onMouseMove() {
        if(!Input.isClicking) return

        this.cameraPosition.x += Input.mouseMovDelta.x 
        this.cameraPosition.y += Input.mouseMovDelta.y
    }

    alertInfo(e) {
        if(e.key === " ")
           console.log(this.cameraPosition)
    }

    updateCamera() {
        this.cam.position.set(
            lerp(this.cam.position.x, this.cameraPosition.x, this.speed), 
            lerp(this.cam.position.y, this.cameraPosition.y, this.speed))

        this.cam.scale.x = lerp(this.cam.scale.x, this.worldZoom, this.speed)
        this.cam.scale.y = lerp(this.cam.scale.y, this.worldZoom, this.speed)
    }

    screenToWorldPos(pos) {
        const worldPos = this.cameraPosition

        const width = this.view.width
        const height = this.view.height

        const cWidth = width / this.worldZoom
        const cHeight = height / this.worldZoom

        const relativePos = new Vector2(pos.x / width, pos.y / height)
        relativePos.x = relativePos.x * cWidth + worldPos.x * -1 / this.worldZoom
        relativePos.y = relativePos.y * cHeight + worldPos.y * -1 / this.worldZoom

        return relativePos
    }
}
