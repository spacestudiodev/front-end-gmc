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
    constructor(app) {
        super()
        CacheRoads.main = this
        this.loading = true
        this.creating = false
        this.roads = undefined
        this.cache = {}
        this.pendings = []
        this.app = app
        this.li = 0

        console.log("Descargando calles...")
        fetch("/map/json/miniroads_v2.json")
            .then(res => res.json())
            .then(json => {
                this.loading = false
                this.creating = true
                this.roads = {...json}
                
                /*
                new Promise((resolve) => {
                    
                    const prerenderCont = new Container()

                    Object.keys(this.roads).map(v => {
                        const x = parseInt(v) % WIDTH
                        const y = parseInt(parseInt(v) / WIDTH)

                        const svg = new SVG(`<svg><path d="${this.roads[v]}" style="${STYLE}"/></svg>`)
                        svg.position.set(x * 143.766, y * 143.766)
                        prerenderCont.addChild(svg)

                        this.cache[v] = svg
                    })

                    this.app.renderer.plugins.prepare.upload(prerenderCont, () => {
                        Object.keys(this.cache).map(v => {
                            this.cache[v].visible = false
                        })

                        this.addChild(prerenderCont)
                        console.log("calles renderizadas")
                    })

                    //this.pendings = Object.keys(this.roads).map(v => {
                    //    const x = parseInt(v) % WIDTH
                    //    const y = parseInt(parseInt(v) / WIDTH)
 
                    //    this.cache[v] = "disable"
                    //    return {path: this.roads[v], x, y}
                    //})

                    resolve()
                }).then(() => {
                    this.creating = false
                    console.log("calles creadas")
                })
                */
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
            this.pendings.push({pos, x, y, create})

            return
        }

        cache.visible = !create
    }

    changeLI(li) {
        this.li = li
    }

    update() {
        for (let i = 0; i < 2; i++) {
            if (this.pendings.length === 0) break
            this.addElement()
        }
    }

    addElement() {
        if (this.pendings.length === 0) return
        if (!this.roads) return

        let pen = undefined

        if (this.li === 0)
            pen = this.pendings.pop()
        else
            pen = this.pendings.shift()

        if (!this.roads[pen?.pos]) return

        const svg = new SVG(`<svg><path d="${this.roads[pen.pos]}" style="${STYLE}"/></svg>`)
        svg.position.set(pen.x * 143.766, pen.y * 143.766)
        this.addChild(svg)

        //this.app.render(svg)

        if (this.cache[pen.pos] === "disable") svg.visible = false

        this.cache[pen.pos] = svg
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
