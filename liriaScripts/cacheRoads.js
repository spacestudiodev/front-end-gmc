import {RenderTexture, Texture} from "@pixi/core"
import {Container} from "@pixi/display"
import {ParticleContainer} from "@pixi/particles"
import {Sprite} from "@pixi/sprite"
import {SVG} from "../modules/pixi-svg"

const WIDTH = 54
const HEIGHT = 87
const STYLE = "fill:none;stroke:#fbb03b;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.75px"

export default class CacheRoads extends Container {
    static main
    constructor() {
        super()
        CacheRoads.main = this
        this.loading = true
        this.creating = false
        this.roads = {}
        this.cache = {}
        this.pendings = []

        console.log("Descargando calles...")
        fetch("/map/json/miniroads_v2.json")
            .then(res => res.json())
            .then(json => {
                this.loading = false
                this.creating = true
                this.roads = {...json}

                new Promise((resolve) => {
                    resolve()
                }).then(() => {
                    this.creating = false
                    console.log("calles creadas")
                })
            })
    }

    get(li, pos) {
        return this.roads[pos / li]
    }

    add(li, x, y) {
        const pos = x + y * WIDTH

        const cache = this.cache[pos]

        if (typeof cache === "string") {
            if (cache === "disable")
                this.cache[pos] = "enable"

            return
        }

        if (!cache) {
            if (this.roads[pos]) {
                this.cache[pos] = "enable"
                this.pendings.push({path: this.roads[pos], x, y})
            }
            return
        }

        cache.visible = true
    }

    update() {
        for (let i = 0; i < 2; i++) {
            if (this.pendings.length === 0) break
            this.addElement()
        }
    }

    addElement() {
        if (this.pendings.length === 0) return
        const pen = this.pendings.shift()
        const svg = new SVG(`<svg><path d="${pen.path}" style="${STYLE}"/></svg>`)
        svg.position.set(pen.x * 143.766, pen.y * 143.766)

        if (this.cache[pen.x + pen.y * WIDTH] === "disable") svg.visible = false

        this.addChild(svg)
        this.cache[pen.x + pen.y * WIDTH] = svg
    }

    delete(li, x, y) {
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
