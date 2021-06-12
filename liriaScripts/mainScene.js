import * as PIXI from "pixi.js"

import dat from 'dat.gui'

import {SVG} from '../modules/pixi-svg'
import Input from "../modules/liria/input"
import GridAPI from "./gridAPI"
import PaintSprites from "./paintSprites"
import DrawSystem from "./drawSystem"
import all_roads from "../districtsMaps/all_roads"
import lima from "../districtsMaps/lima"
import CacheRoads from "./cacheRoads";
import DynamicObject from "./DynamicObjects";
import vp from "./viewport";
import {Application, Renderer} from "pixi.js";
import CameraSystem from "./cameraSystem"
import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

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
        this.app = app
        app.stop()

        const viewport = vp.createRenderer(app.renderer)
        app.stage.addChild(viewport)

        this.debugContainer = new PIXI.Container()
        app.stage.addChild(this.debugContainer)

        viewport.addChild(this)

        const mainMap = new PIXI.Container()

        const map = new SVG(lima)
        this.addChild(mainMap)

        map.position.set(232.075, -587.648)
        mainMap.addChild(map)

        //const map2 = map.clone()
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

        const input = new Input(app.view)

        GridAPI.init(this, {
            gizmos: false
        })

        this.paint = new PaintSprites(app.stage)
        this.camera = new CameraSystem(this.debugContainer)

        this.cacheRoads = new CacheRoads(app)
        this.cacheRoads.position.set(1, 2)
        mainMap.addChild(this.cacheRoads)

        mainMap.addChild(new SVG(all_roads))

        this.addChild(new DrawSystem())
        this.addChild(new DynamicObject())

        this.dispose = () => {
            input.dispose()
            datUI.destroy()
        }

        this.update()
    }

    update() {
        stats.begin()
        const viewport = vp.get()

        if (viewport.dirty) {
            this.cacheRoads.update()
            this.camera.update()
            this.paint.update()
            this.app.render()

            viewport.dirty = false
        }

        stats.end()

        requestAnimationFrame(this.update.bind(this))
    }

    static init(renderer) {
        return new MainScene(renderer)
    }
}
