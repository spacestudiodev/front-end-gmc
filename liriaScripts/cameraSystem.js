import {datUI} from "./mainScene";
import {getViewport} from "./viewport";
import * as PIXI from 'pixi.js';
import Vector2 from "../modules/liria/vector2";
import GridAPI from "./gridAPI";
import Input from "../modules/liria/input"

const PARAMS = {
    simule_width: window.innerWidth + 320,
    simule_height: window.innerHeight + 171,
    position_x: -280.01,
    position_y: -5630.01,
    camera_zoom: 0.424100001,
    zoom: 0.01
}

export default class CameraSystem {
    static main

    constructor(container) {
        CameraSystem.main = this
        this.viewport = getViewport()

        // --- DEBUG ---
        // --- Dibujo de camara simulada ---

        this.cameraDraw = new PIXI.Graphics()
        container.addChild(this.cameraDraw)

        // --- ---
        // --- Parametros de camara ---
        const cameraFolder = datUI.addFolder("Camera")
        this.zPos = 0

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

        Input.onKeyDown(e => {
            if (e.key === "z") {
                this.goToPos()
            }
        })

        //setTimeout(this.goToPos.bind(this), 3000)
    }

    update() {
        this.updateParams()
        const {from, to} = this.getFromToCamera()

        if (GridAPI.main)
            GridAPI.update(PARAMS.zoom, from, to)
    }

    updateParams() {
        PARAMS.position_x = this.viewport.left
        PARAMS.position_y = this.viewport.top
        PARAMS.camera_zoom = this.viewport.scaled
        PARAMS.zoom = parseInt(Math.log(PARAMS.camera_zoom.toFixed(2)) / Math.log(1.16)) + 5
        this.zPos = PARAMS.zoom
        this.cameraParams?.updateDisplay()
    }

    goToPos() {
        this.viewport.animate({
            time: 1000,
            position: {x: 2357, y: 6230},
            scale: 4.5,
            ease: 'easeInOutQuad',
        })
    }

    getFromToCamera() {
        const camPos = new Vector2(PARAMS.position_x, PARAMS.position_y)
        const worldZoom = PARAMS.camera_zoom

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

        const from = new Vector2(camPos.x + widthDiff / worldZoom,
            camPos.y + heightDiff / worldZoom)

        const to = new Vector2(
            this.viewport.right - widthDiff / worldZoom,
            this.viewport.bottom - heightDiff / worldZoom)

        to.x = to.x
        to.y = to.y

        return {from, to}
    }

    screenToWorldPos(pos) {
        const worldPos = new Vector2(PARAMS.position_x, PARAMS.position_y)
        const worldZoom = PARAMS.camera_zoom

        const width = window.innerWidth
        const height = window.innerHeight

        const cWidth = width / worldZoom
        const cHeight = height / worldZoom

        const relativePos = new Vector2(pos.x / width, pos.y / height)
        relativePos.x = relativePos.x * cWidth + worldPos.x
        relativePos.y = relativePos.y * cHeight + worldPos.y

        return relativePos
    }

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

        this.viewport.dirty = true
    }
}
