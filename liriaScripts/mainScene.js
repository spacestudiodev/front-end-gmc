import {Application} from "@pixi/app";
import * as PIXI from "pixi.js"

import dat from 'dat.gui'

import {SVG} from '../modules/pixi-svg'
import Camera from "../modules/liria/camera"
import Input from "../modules/liria/input"
import GridAPI from "./gridAPI"
import PaintSprites from "./paintSprites"
import DrawSystem from "./drawSystem"
import all_roads from "../districtsMaps/all_roads"
import lima from "../districtsMaps/lima"

const datUI = new dat.GUI({name: "Debug"})

export {datUI}

export default class MainScene extends PIXI.Container {
    /**
     * Escena inicial
     *
     * @param {Application} app
     */
    constructor(app) {
        super()
        app.stage.addChild(this)

        const mainMap = new PIXI.Container()
        const map = new SVG(lima)
        const map2 = new SVG(lima)
        map.position.set(232.075, -587.648)
        map2.position.set(232.075, -587.648)
        mainMap.addChild(map)
        //mainMap.addChild(map2)

        /*
        const tx = PIXI.Texture.from("map/texture.jpg")

        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 7; y++) {
                const texture = PIXI.Sprite.from(tx)
                texture.blendMode = PIXI.BLEND_MODES.MULTIPLY
                texture.alpha = 0.7
                texture.scale.x = texture.scale.y = 2
                texture.position.set(232.075 + x * 1024* 2, -587.648 + y * 1024 * 2)
                texture.mask = map

                mainMap.addChild(texture)
            }
        }
        */

        mainMap.addChild(new SVG(all_roads))

        this.addChild(mainMap)

        const input = new Input(app.view)

        GridAPI.init(this, {
            gizmos: false
        })

        const paint = new PaintSprites(this)
        const camera = new Camera(this, app)
        this.addChild(new DrawSystem())

        app.ticker.add(() => {
            camera.update()
            paint.update()
        })

        this.dispose = () => {
            input.dispose()
            datUI.destroy()
        }
    }

    static init(app) {
        return new MainScene(app)
    }
}

function addsvg(data) {
    const svg = new SVG(data.svg)
    svg.position.set(data.position[0], data.position[1])
    return svg
}






