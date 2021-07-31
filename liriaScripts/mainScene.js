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
import DrawSystemTilemap from "./drawSystemTilemap"

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

        const loader = PIXI.Loader.shared
            .add("map/allText.json")

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

        this.viewport = vp.createRenderer(app.renderer) // Iniciamos el viewport
        app.stage.addChild(this.viewport)
        this.viewport.addChild(this)

        this.debugContainer = new PIXI.Container() // Contenedor para los Debugs
        app.stage.addChild(this.debugContainer)

        const mainMap = new PIXI.Container() // Contenedor principal para el mapa
        this.addChild(mainMap)

        const map = new SVG(lima) //Mapa principal SVG
        map.position.set(232.075, -587.648)
        mainMap.addChild(map)

        const mask = map.clone() // Mascara del mapa en SVG
        mask.position.set(232.075, -587.648)
        mainMap.addChild(mask)

        // --------- Componentes ---------

        const input = new Input(app.view) // Iniciamos los Input

        GridAPI.init(this, {gizmos: false}) // Inicializar GRID

        this.textureManager = new TextureManager().init(app.stage) // Textura superpuesta

        this.drawSystem = new DrawSystemTilemap().init() // Pintado de casas


        const mapDisable = new PIXI.Container() // Textura de los limites
        mainMap.addChild(mapDisable)

        // Texturas de los limites (Incluyendo la del todo el mapa)
        this.limitsTextures = new LimitsTexture(mask, mapDisable).init(mainMap)

        //this.cacheRoads = new CacheRoads(app).init(mainMap)
        //this.cacheRoads.position.set(1, 2)

        // --------- EDITOR ---------
        //this.paint = new PaintSprites(this)
        // --------- ---------

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
        loader.load()
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
            this.limitsTextures?.update()

            this.app.render()

            if (this.stats) {
                this.stats.update()

                const dc = this.stats.hook.drawCalls - this.lastDrawCall
                drawCallsPanel.update(dc, 100)

                this.lastDrawCall = this.stats.hook.drawCalls
            }
        } else {
        }
        stats.end()

        requestAnimationFrame(this.update.bind(this))
    }

    static init(renderer) {
        return new MainScene(renderer)
    }
}
