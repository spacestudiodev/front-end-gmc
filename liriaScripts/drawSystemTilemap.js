import {CompositeTilemap} from "../modules/tilemap";
import LiriaComponent from "./classes/liriaComponent";
import {elementsDefault} from "./elementNode";
import GridAPI from "./gridAPI";

export default class DrawSystemTilemap extends LiriaComponent {
    constructor() {
        super()
        this.loader.add("map/json/housepositions.json")
        this.layer0 = new CompositeTilemap()
        this.layer1 = new CompositeTilemap()
        this.addChild(this.layer0)
        this.addChild(this.layer1)
        GridAPI.main.on("zoomChange", this.onGridZoomChange.bind(this))
    }

    onGridZoomChange(layer) {
        this.layer0.visible = layer === 0
        this.layer1.visible = layer === 1
    }

    generateLayer(data, tilemap) {
        const keys = Object.keys(data)

        for (let i = 0; i < keys.length; i++) {
            const elements = data[keys[i]]
            for (let j = 0; j < elements.length; j = j + 5) {
                const elid = elements[j]
                const x = elements[j + 1]
                const y = elements[j + 2]
                const scale = elements[j + 3]

                tilemap.tile(elementsDefault[elid].texture, x, y, {
                    scale,
                    anchorX: 0.5,
                    anchorY: 0.5,
                })
            }
        }
    }

    onLoadComplete() {
        const rhp = this.loader.resources["map/json/housepositions.json"]

        if (rhp && rhp.data) {
            if (rhp.data[0])
                this.generateLayer(rhp.data[0], this.layer0)
            if (rhp.data[1])
                this.generateLayer(rhp.data[1], this.layer1)
        }
    }
}
