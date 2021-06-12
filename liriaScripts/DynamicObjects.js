import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import {datUI} from "./mainScene";

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

    return { x, y }
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
        // ------------
        // Obteniendo puntos
        // ------------
    
        //fetch("")
        
        //-------------
        this.points = [
            toXY("-12.506961835753327, -76.72757187793852"),
            toXY("-11.73331257645088, -77.14144476094901"),
            toXY("-12.054831825237562, -77.04643898081297"),
            toXY("-12.04280420859264, -77.13804820624934"),
            toXY("-12.081315088821107, -76.91352310950725"),
            toXY("-12.136222101532981, -76.75655006086475"),
            toXY("-12.48624831394058, -76.73685961895109"),
            toXY("-12.486236227003007, -76.73533469050187"),
            toXY("-12.054848142763175, -77.04674332559155"),
            toXY("-12.081035142160841, -76.91082423714806"),
            toXY("-12.079532497172774, -76.90868857773012"),
        ]

        this.elements = []

        const circle = new Graphics()
        circle.beginFill(0xff0000, 0.7)
        circle.drawCircle(0, 0, 3)
        circle.endFill()

        circle.beginFill(0xff0000)
        circle.drawCircle(0, 0, 1)
        circle.endFill()

        for (let i = 0; i < this.points.length; i++) {
            const nCircle = circle.clone()
            const curr = this.points[i]

            const normalizeX = curr.x.normalizeMinMax(Math.min(GEO_1.x, GEO_2.x), Math.max(GEO_1.x, GEO_2.x))
            const normalizeY = curr.y.normalizeMinMax(Math.min(GEO_1.y, GEO_2.y), Math.max(GEO_1.y, GEO_2.y))

            const REL = {
                x: TARG_2.x - TARG_1.x,
                y: TARG_2.y - TARG_1.y
            }

            const resultX = normalizeX * REL.x + TARG_1.x - COMP.x
            const resultY = normalizeY * REL.y + TARG_1.y - COMP.y

            console.log(resultX, resultY)

            nCircle.position.set(resultX, resultY)
            this.addChild(nCircle)
            this.elements.push(nCircle)
        }

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
}
