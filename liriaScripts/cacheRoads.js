import * as PIXI from "pixi.js"
import {SVG} from "../modules/pixi-svg"
import AvenuesNames from "./avenuesNames"
import BatchRendering from "./batchRendering"
import LiriaComponent from "./classes/liriaComponent"
import {getViewport} from "./viewport"

const WIDTH = 54
const HEIGHT = 87
const STYLE = "fill:none;stroke:#e3c9a5;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.75px"

export default class CacheRoads extends LiriaComponent {
    static main
    constructor(app) {
        super()
        CacheRoads.main = this
        this.viewport = getViewport()
        this.batchRender = new BatchRendering()
        this.addChild(this.batchRender.container)
        this.batchRender.container.blendMode = PIXI.BLEND_MODES.LUMINOSITY
        //this.alpha = 0.4

        this.loading = true
        this.roads = undefined
        this.cache = {}

        console.log("Descargando calles...")
        this.avenues = new AvenuesNames()
        fetch("/map/json/miniroads_v2.json")
            .then(res => res.json())
            .then(json => {
                this.loading = false
                this.roads = {...json}
            })
    }

    add(x, y, create = false) {
        const pos = x + y * WIDTH

        const cache = this.cache[pos]

        if (typeof cache === "string") {
            if (cache === "disable" && !create)
                this.cache[pos] = "enable"
            return
        }

        if (!cache) {
            if (!create && !this.roads[pos]) return

            this.cache[pos] = create ? "disable" : "enable"
            this.batchRender.add(() => {
                const cont = new PIXI.Container()
                const road = new SVG(`<svg><path d="${this.roads[pos]}" style="${STYLE}"/></svg>`)
                road.position.set(x * 143.766, y * 143.766)

                if (this.cache[pos] === "disable") cont.visible = false

                cont.addChild(road)

                if (this.avenues.containInPos(pos))
                    cont.addChild(this.avenues.create(pos))

                this.cache[pos] = cont
                return cont
            })

            return
        }

        cache.visible = !create
    }

    update() {
        this.batchRender.render()
    }

    delete(x, y) {
        const pos = x + y * WIDTH
        const cache = this.cache[pos]

        if (typeof cache !== "string" && cache !== undefined) {
            cache.visible = false
        }
        else if (typeof cache === "string") {
            this.cache[pos] = "disable"
        }
    }
}
