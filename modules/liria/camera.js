import Input from "./input"
import {clamp, lerp} from "./mathHelper"
import Vector2 from "./vector2"
import * as PIXI from "pixi.js"
import GridAPI from "../../liriaScripts/gridAPI"
import {datUI} from "../../liriaScripts/mainScene"

const PARAMS = {
    simule_width: window.innerWidth + 320,
    simule_height: window.innerHeight + 171,
    position_x: -280.01,
    position_y: -5630.01,
    camera_zoom: 0.4241,
    zoom: 0.01
}

export default class Camera {
    static main

    cameraPosition = new Vector2()
    worldZoom = 1
    zPos = 0

    updateSimuleCameraGizmo() {
        this.cameraDraw.clear()
        this.cameraDraw.lineStyle(2, 0xF70000)

        const wwidth = window.innerWidth
        const wheight = window.innerHeight

        const SIMULE_WIDTH = PARAMS.simule_width === 0
            ? wwidth
            : PARAMS.simule_width
        const SIMULE_HEIGHT = PARAMS.simule_height === 0
            ? wheight
            : PARAMS.simule_height

        this.cameraDraw.drawRect(0, 0, SIMULE_WIDTH, SIMULE_HEIGHT)
        this.cameraDraw.position.set(
            wwidth / 2 - SIMULE_WIDTH / 2,
            wheight / 2 - SIMULE_HEIGHT / 2)
    }

    constructor(container, app) {
        Camera.main = this
        this.lastScroll = 0
        this.cam = container
        this.view = app.view
        this.speed = 1

        //this.text = new PIXI.Text(this.zPos, {fontSize: 14})
        //app.stage.addChild(this.text)

        Input.onMouseScroll(this.onMouseScroll.bind(this))
        Input.onMouseMove(this.onMouseMove.bind(this))

        this.cam.scale.x = this.cam.scale.y = this.worldZoom = this.nextZoom = PARAMS.camera_zoom
        this.cameraPosition = new Vector2(PARAMS.position_x * this.worldZoom, PARAMS.position_y * this.worldZoom)
        this.cam.position.set(this.cameraPosition.x, this.cameraPosition.y)
        this.zPos = -10.2
        this.zPos = clamp(this.zPos, 0 - 1.5 * 6, 4.75 * 6 - 1.5 * 6)

        this.movDir = new Vector2(0, 0)
        this.movSpeed = 0

        // --- DEBUG ---
        // --- Dibujo de camara simulada ---
        this.cameraDraw = new PIXI.Graphics()
        container.parent.addChild(this.cameraDraw)
        // --- ---
        // --- Parametros de camara ---

        const cameraFolder = datUI.addFolder("Camera")

        this.cameraParams = cameraFolder.addFolder("Params")
        this.cameraParams.add(PARAMS, "position_x").name("X")
        this.cameraParams.add(PARAMS, "position_y").name("Y")
        this.cameraParams.add(PARAMS, "camera_zoom").name("Camera Zoom")
        this.cameraParams.add(PARAMS, "zoom").name("Zoom")
        this.cameraParams.open()

        const simulationFolder = cameraFolder.addFolder("Camera Simulation")
        simulationFolder.open()

        simulationFolder.add(PARAMS, "simule_width", 0, 3000).name("Width")
            .onChange(this.updateSimuleCameraGizmo.bind(this))
        simulationFolder.add(PARAMS, "simule_height", 0, 3000).name("Height")
            .onChange(this.updateSimuleCameraGizmo.bind(this))

        this.updateSimuleCameraGizmo()

        cameraFolder.open()

        // --- ---
    }

    onMouseScroll() {
        const mDeltaY = Input.mouseScrollDelta.y
        const deltaY = mDeltaY

        const pos = Input.mousePosition
        const relativePos = this.screenToWorldPos(pos)

        const lastZoom = this.worldZoom

        this.zPos += deltaY
        this.zPos = clamp(this.zPos, 0 - 1.5 * 6, 4.75 * 6 - 1.5 * 6)
        this.worldZoom = Math.pow(1.1, this.zPos)

        const dif = this.worldZoom - lastZoom

        this.cameraPosition.x -= relativePos.x * dif
        this.cameraPosition.y -= relativePos.y * dif
    }

    update(dt) {
        this.updateCamera(dt)
        const {from, to} = this.getFromToCamera()
        GridAPI.update(this.zPos, from, to)
    }

    onMouseMove() {
        if (!Input.isClicking) return

        this.movDir = Input.mouseMovDelta
        this.movSpeed = 1
    }

    updateCamera(dt) {
        const camX = lerp(this.cam.position.x, this.cameraPosition.x, this.speed)
        const camY = lerp(this.cam.position.y, this.cameraPosition.y, this.speed)
        this.cam.position.set(camX, camY)

        this.cam.scale.x = lerp(this.cam.scale.x, this.worldZoom, this.speed)
        this.cam.scale.y = lerp(this.cam.scale.y, this.worldZoom, this.speed)

        this.cameraPosition.x += this.movDir.x * this.movSpeed
        this.cameraPosition.y += this.movDir.y * this.movSpeed
        
        this.movSpeed = lerp(this.movSpeed, 0, 0.08)

        if(this.movSpeed < 0) this.movSpeed = 0

        if(Input.isClicking) this.movDir = new Vector2()

        // [DEBUG]
        PARAMS.position_x = (camX * -1 / this.cam.scale.x)
        PARAMS.position_y = (camY * -1 / this.cam.scale.y)
        PARAMS.camera_zoom = this.cam.scale.x
        PARAMS.zoom = this.zPos / 6 + 1.5
        this.cameraParams.updateDisplay()
        // ----
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

    getFromToCamera() {
        const camPos = new Vector2(this.cam.position.x, this.cam.position.y)
        const worldZoom = this.cam.scale.x

        const wwidth = window.innerWidth
        const wheight = window.innerHeight

        const SIMULE_WIDTH = PARAMS.simule_width === 0
            ? wwidth
            : PARAMS.simule_width
        const SIMULE_HEIGHT = PARAMS.simule_height === 0
            ? wheight
            : PARAMS.simule_height

        const widthDiff = wwidth / 2 - SIMULE_WIDTH / 2
        const heightDiff = wheight / 2 - SIMULE_HEIGHT / 2

        const from = new Vector2(
            (camPos.x - widthDiff) * -1 / worldZoom,
            (camPos.y - heightDiff) * -1 / worldZoom)
        const to = new Vector2(
            camPos.x - widthDiff - SIMULE_WIDTH,
            camPos.y - heightDiff - SIMULE_HEIGHT)

        to.x = to.x * -1 / worldZoom
        to.y = to.y * -1 / worldZoom

        return {from, to}
    }
}
