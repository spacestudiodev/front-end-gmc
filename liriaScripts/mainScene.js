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
import Stats, {Panel} from 'stats.js'
import TextureManager from "./textureManager"
import LimitsTexture from "./limitsTexture"
import AvenuesNames from "./avenuesNames"

import {CompositeTilemap} from "../modules/tilemap"

import * as GStats from "gstats"
import {elementsDefault} from "./elementNode"

const drawCallsPanel = new Panel("Dcalls", "#5F5D5B", "#EFD730")
const stats = new Stats()
stats.addPanel(drawCallsPanel)

stats.showPanel(0)
document.body.appendChild(stats.dom)
stats.update()

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

        this.stats = undefined

        // DEBUG
        setTimeout(() => {
            const pixihooks = new GStats.PIXIHooks(app)
            this.stats = new GStats.StatsJSAdapter(pixihooks)
        }, 1000)
        // ---

        MainScene.main = this
        this.app = app
        app.stop() // Detenemos renderizador automatico

        // Iniciamos el viewport
        this.viewport = vp.createRenderer(app.renderer)
        app.stage.addChild(this.viewport)
        this.viewport.addChild(this)

        // Contenedor para los Debugs
        this.debugContainer = new PIXI.Container()
        app.stage.addChild(this.debugContainer)

        // Contenedor principal para el mapa
        const mainMap = new PIXI.Container()
        this.addChild(mainMap)

        //mainMap.filters = [new AdjustmentFilter({
        //  saturation: 0.9,
        //})]

        const map = new SVG(lima)
        map.position.set(232.075, -587.648)
        mainMap.addChild(map)

        const mask = map.clone()
        mask.position.set(232.075, -587.648)
        mainMap.addChild(mask)
        //const mask = undefined

        const input = new Input(app.view)
        // --------- Componentes ---------

        this.textureManager = new TextureManager().init(app.stage)

        this.limitsTextures = new LimitsTexture(mask).init(mainMap)
        this.limitsTextures.position.set(232.075, -587.648)
        this.limitsTextures.scale.set(6.95, 6.95)

        const textureMapCont = new PIXI.Container()
        mainMap.addChild(textureMapCont)

        this.cacheRoads = new CacheRoads(app).init(mainMap)
        this.cacheRoads.position.set(1, 2)

        //new DrawSystem().init()

        GridAPI.init(this, {gizmos: false})

        //this.paint = new PaintSprites(this)

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
            .add("map/json/housepositions.json")

        loader
            .load(() => {
                // --- Pintar primer nivel con tilemap

                const tilemap = new CompositeTilemap()
                this.addChild(tilemap)

                const rhp = loader.resources["map/json/housepositions.json"]

                let iteracion = 0

                if (rhp && rhp.data && rhp.data[0]) {
                    const hpos = rhp.data[0]
                    const keys = Object.keys(hpos)

                    for (let i = 0; i < keys.length; i++) {
                        const elements = hpos[keys[i]]
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

                            iteracion++
                        }
                    }
                }

                // --- Pintar limites
                const sheet = loader.resources["map/alllimitations.json"]
                const json = sheet.data.frames
                const keys = Object.keys(json)
                for (let i = 0, len = keys.length; i < len; i++) {
                    if (keys[i] !== "puentepiedra.png") continue

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
                    sprite.visible = false

                    textureMapCont.addChild(svg)
                    textureMapCont.addChild(sprite)
                }
            })
    }

    lastDrawCall = 0

    update() {
        stats.begin()

        if (this.viewport.dirty) {
            this.viewport.dirty = false

            this.cacheRoads?.update()
            this.camera?.update()
            this.paint?.update()
            this.dynamicObject?.update()

            this.textureManager?.update()

            this.app.render()

            if (this.stats) {
                this.stats.update()

                const dc = this.stats.hook.drawCalls - this.lastDrawCall
                drawCallsPanel.update(dc, 100)

                this.lastDrawCall = this.stats.hook.drawCalls
            }
        } else {
            this.app
        }
        stats.end()

        requestAnimationFrame(this.update.bind(this))
    }

    static init(renderer) {
        return new MainScene(renderer)
    }
}
