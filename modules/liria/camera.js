import Liria from "."
import Component from "./component"
import Input from "./input"
import {lerp} from "./mathHelper"
import Vector2 from "./vector2"
import * as PIXI from "pixi.js"

export default class Camera {
    static main
    
    cameraPosition = new Vector2()
    worldZoom = 1
    zPos = 0

    constructor(container, app) {
        Camera.main = this
        this.nextZoom = 1
        this.lastScroll = 0
        this.cam = container
        this.view = app.view
        this.speed = 0.2

        this.text = new PIXI.Text(this.zPos, { fontSize: 14 })
        app.stage.addChild(this.text)

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

        console.log(this.cameraPosition.x / this.worldZoom, this.cameraPosition.y / this.worldZoom)
        console.log(this.view.width / this.worldZoom, this.view.height / this.worldZoom)
    }

    update() {
        this.updateCamera()
        this.showDebug()
    }

    onMouseMove() {
        if(!Input.isClicking) return

        this.cameraPosition.x += Input.mouseMovDelta.x 
        this.cameraPosition.y += Input.mouseMovDelta.y
    }

    updateCamera() {
        const camX = lerp(this.cam.position.x, this.cameraPosition.x, this.speed)
        const camY = lerp(this.cam.position.y, this.cameraPosition.y, this.speed)
        this.cam.position.set(camX, camY)

        this.cam.scale.x = lerp(this.cam.scale.x, this.worldZoom, this.speed)
        this.cam.scale.y = lerp(this.cam.scale.y, this.worldZoom, this.speed)

        this.printDebug(`Camera Position: (${(camX * -1 / this.cam.scale.x).toFixed(4)}, ${(camY * -1 / this.cam.scale.x).toFixed(4)})`)
        this.printDebug("Camera Zoom: " + this.cam.scale.x.toFixed(4)) 
        this.printDebug(`Zoom int: ${this.zPos / 6 + 2.75}`)
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

    printDebug(text) {
        this.textDebug += text + "\n"
    }

    showDebug() {
        this.text.text = this.textDebug
        this.textDebug = ""
    }
}
