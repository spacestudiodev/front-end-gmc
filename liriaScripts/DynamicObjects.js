import {Texture} from "@pixi/core";
import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import {Sprite} from "@pixi/sprite";
import Input from "../modules/liria/input";
import {datUI} from "./mainScene";
import {getViewport} from "./viewport";

function toGeo(coor) {
    const parts = coor.split(",")
    return {
        lat: parseFloat(parts[0]),
        lon: parseFloat(parts[1])
    }
}

function toXY(coor) {
    const {lat, lon} = toGeo(coor)

    const mw = 200000
    const mh = 100000

    const x = (lon + 180) * (mw / 360)
    const latRad = lat * Math.PI / 180

    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)))
    const y = (mh / 2) - (mw * mercN / (2 * Math.PI))

    return {x, y}
}

Number.prototype.normalizeMinMax = function (min, max) {
    return (this - min) / (max - min)
}

const GEO_1 = toXY("-11.731576617659666, -77.15196283012733")
const TARG_1 = {
    x: 1166,
    y: 1908
}

const GEO_2 = toXY("-12.50682662742688, -76.72758486791383")
const TARG_2 = {
    x: 6705.5,
    y: 12258
}

const COMP = {
    x: 136.7,
    y: 23.7
}

export default class DynamicObject extends Container {
    constructor() {
        super()
        this.viewport = getViewport()
        // ------------
        // Obteniendo puntos
        // ------------

        this.points = []
        this.textures = [
            "/images/burbujas/calavera.png",
            "/images/burbujas/fardo.png",
            "/images/burbujas/jarro.png",
            "/images/burbujas/molusco.png",
            "/images/burbujas/mortero.png",
            "/images/burbujas/piramide1.png",
        ]
        this.elements = []
        this.idDelete = []

        fetch("/map/json/points.json")
            .then(response => response.json())
            .then(json => {

                this.points = json.points.map(val => {
                    const url = val.url_google.split('@')
                    const dir = url[1].split(',')

                    const lat = dir[0]
                    const lon = dir[1]

                    val.position = toXY(`${lat}, ${lon}`)
                    return val
                })

                for (let i = 0; i < this.points.length; i++) {
                    const point = this.points[i]
                    const curr = point.position
                    const texture = Texture.from(this.textures[parseInt(Math.random() * this.textures.length)])
                    const sprite = new Sprite(texture)
                    sprite.anchor.x = sprite.anchor.y = 0.5
                    sprite.scale.x = sprite.scale.y = 0.6

                    const normalizeX = curr.x.normalizeMinMax(Math.min(GEO_1.x, GEO_2.x), Math.max(GEO_1.x, GEO_2.x))
                    const normalizeY = curr.y.normalizeMinMax(Math.min(GEO_1.y, GEO_2.y), Math.max(GEO_1.y, GEO_2.y))

                    const REL = {
                        x: TARG_2.x - TARG_1.x,
                        y: TARG_2.y - TARG_1.y
                    }

                    const resultX = normalizeX * REL.x + TARG_1.x - COMP.x
                    const resultY = normalizeY * REL.y + TARG_1.y - COMP.y

                    sprite.position.set(resultX, resultY)

                    sprite.interactive = true
                    sprite.on("click", () => {
                        sprite.visible = false
                        this.viewport.dirty = true
                        this.idDelete.push(point.id)
                    })

                    this.addChild(sprite)
                    this.elements.push(sprite)
                }

            })

        //-------------
        
        Input.onKeyDown(e => {
            if(e.key === "ñ") {
                this.points = this.points.map(v => {
                    let isR = true

                    this.idDelete.forEach(id => {
                        if(v.id === id) isR = false
                    })

                    if(isR) return v
                })

                this.points = this.points.filter(v => v)

                console.log(JSON.stringify(this.points))
            }
        })

        const debug = datUI.addFolder("Dynamic Objects")

        debug.add(TARG_1, "x").name("X 1").onChange(val => {
            TARG_1.x = val
            this.updatePositions()
        })
        debug.add(TARG_1, "y").name("Y 1").onChange(val => {
            TARG_1.y = val
            this.updatePositions()
        })
        debug.add(TARG_2, "x").name("X 2").onChange(val => {
            TARG_2.x = val
            this.updatePositions()
        })
        debug.add(TARG_2, "y").name("Y 2").onChange(val => {
            TARG_2.y = val
            this.updatePositions()
        })
        debug.add(COMP, "x").name("Comp x").onChange(val => {
            COMP.x = val
            this.updatePositions()
        })
        debug.add(COMP, "y").name("Comp y").onChange(val => {
            COMP.y = val
            this.updatePositions()
        })

        debug.open()
    }

    updatePositions() {
        for (let i = 0; i < this.points.length; i++) {
            const curr = this.points[i]
            const el = this.elements[i]

            const normalizeX = curr.x.normalizeMinMax(Math.min(GEO_1.x, GEO_2.x), Math.max(GEO_1.x, GEO_2.x))
            const normalizeY = curr.y.normalizeMinMax(Math.min(GEO_1.y, GEO_2.y), Math.max(GEO_1.y, GEO_2.y))

            const REL = {
                x: TARG_2.x - TARG_1.x,
                y: TARG_2.y - TARG_1.y
            }

            const resultX = normalizeX * REL.x + TARG_1.x - COMP.x
            const resultY = normalizeY * REL.y + TARG_1.y - COMP.y

            el.position.set(resultX, resultY)
        }
    }

    lastZoom = undefined
    update() {
        const worldZoom = this.viewport.scaled

        if (this.lastZoom && this.lastZoom !== worldZoom) {
            for (let i = 0; i < this.points.length; i++) {
                const el = this.elements[i]
                el.scale.x = el.scale.y = 1 / worldZoom * 0.6
            }
        }

        this.lastZoom = worldZoom
    }
}
