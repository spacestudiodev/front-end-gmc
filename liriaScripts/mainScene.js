import * as PIXI from "pixi.js"

import dat from 'dat.gui'

import {SVG} from '../modules/pixi-svg'
import Input from "../modules/liria/input"
import GridAPI from "./gridAPI"
import PaintSprites from "./paintSprites"
import DrawSystem from "./drawSystem"
import all_roads from "../districtsMaps/all_roads"
import lima from "../districtsMaps/lima"
import {AdjustmentFilter} from "pixi-filters"
import limitBrena from '../districtsMaps/limitBrena'
import CacheRoads from "./cacheRoads";
import DynamicObject from "./DynamicObjects";
import vp from "./viewport";
import {Application, ParticleContainer, Renderer} from "pixi.js";
import CameraSystem from "./cameraSystem"
import Stats from 'stats.js'
import TextureManager from "./textureManager"
import LimitsTexture from "./limitsTexture"
import AvenuesNames from "./avenuesNames"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const datUI = new dat.GUI({name: "Debug"})

export {datUI}

export default class MainScene extends PIXI.Container {
    static main

    /**
     * Escena inicial
     *
     * @param {Application} app
     */
    constructor(app) {
        super()

        MainScene.main = this
        this.app = app
        app.stop() // Detenemos renderizador automatico

        // Iniciamos el viewport
        const viewport = vp.createRenderer(app.renderer)
        app.stage.addChild(viewport)
        viewport.addChild(this)

        // Contenedor para los Debugs
        this.debugContainer = new PIXI.Container()
        app.stage.addChild(this.debugContainer)

        // Contenedor principal para el mapa
        const mainMap = new PIXI.Container()
        this.addChild(mainMap)

        //mainMap.filters = [new AdjustmentFilter({
            //saturation: 0.9,
        //})]

        const map = new SVG(lima)
        map.position.set(232.075, -587.648)
        mainMap.addChild(map)

        const mask = map.clone()
        mask.position.set(232.075, -587.648)
        mainMap.addChild(mask)

        const input = new Input(app.view)
        // --------- Componentes ---------

        this.textureManager = new TextureManager(mask).init()
        
        this.limitsTextures = new LimitsTexture(mask).init(mainMap)
        this.limitsTextures.position.set(232.075, -587.648)
        this.limitsTextures.scale.set(6.95, 6.95)

        const textureMapCont = new PIXI.Container()
        mainMap.addChild(textureMapCont)

        this.cacheRoads = new CacheRoads(app).init(mainMap)
        this.cacheRoads.position.set(1, 2)

        new DrawSystem().init()

        GridAPI.init(this, {gizmos: false})

        this.paint = new PaintSprites(this)
        this.camera = new CameraSystem(this.debugContainer)

        mainMap.addChild(new SVG(all_roads))

        // --------- Elementos en el mapa ---------

        //this.dynamicObject = new DynamicObject()
        //this.addChild(this.dynamicObject)

        // --------- ---------
        
        this.dispose = () => {
            input.dispose()
            datUI.destroy()
        }

        this.update()
        datUI.close()

        const loader = PIXI.Loader.shared
            .add("map/alllimitations.json")
            .add("map/allText.json")

        loader
            .load(() => {
                const sheet = loader.resources["map/alllimitations.json"]
                const json = sheet.data.frames
                const keys = Object.keys(json)
                for (let i = 0, len = keys.length; i < len; i++) {
                    if(keys[i] !== "puentepiedra.png") continue

                    const el = json[keys[i]]
                    const svg = new SVG(`<svg><path d="${el.path}" fill="white"></path></svg>`)
                    svg.x = el.pos[0] + 232.075 + 6.5
                    svg.y = el.pos[1] - 587.648 + 8
                    const sprite = new PIXI.Sprite(sheet.textures[keys[i]])
                    sprite.anchor.set(0.5, 0.5)
                    sprite.scale.set(2, 2)
                    sprite.x = svg.x + svg.width / 2
                    sprite.y = svg.y + svg.height / 2
                    sprite.mask = svg
                    sprite.visible = true

                    textureMapCont.addChild(svg)
                    textureMapCont.addChild(sprite)
                }
            })
    }

    update() {
        stats.begin()
        const viewport = vp.get()

        if (viewport.dirty) {
            viewport.dirty = false

            this.cacheRoads?.update()
            this.camera?.update()
            this.paint?.update()
            this.dynamicObject?.update()

            this.textureManager?.update()

            this.app.render()
        }

        stats.end()

        requestAnimationFrame(this.update.bind(this))
    }

    static init(renderer) {
        return new MainScene(renderer)
    }
}
