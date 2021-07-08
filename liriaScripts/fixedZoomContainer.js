import * as PIXI from "pixi.js"
import {getViewport} from "./viewport"

export default class FixedZoomContainer extends PIXI.Container {
    constructor(zoom, zoomMax = 0, zoomMin = 0){
        super()
        this.viewport = getViewport()
        this.relativeZoom = zoom
        this.zoomMax = zoomMax
        this.zoomMin = zoomMin
    }

    updateTransform() {
        super.updateTransform()
        this.scale.x = this.scale.y = 1 / this.viewport.scaled * this.relativeZoom
    }
}
