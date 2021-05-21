import {Application} from "@pixi/app";
import {Container} from "@pixi/display"

import dat from 'dat.gui'

import { SVG } from '../modules/pixi-svg'
import {
    lima_fencing_highway, 
    lima_fencing_major_roads, 
    lima_fencing_perimeter,
    lima_fencing_roads
} from '../districtsMaps/lima_fencing'

import {brena_district} from '../districtsMaps/brena'
import Camera from "../modules/liria/camera";
import Input from "../modules/liria/input";
import GridAPI from "./gridAPI";
import PaintSprites from "./paintSprites";
import DrawSystem from "./drawSystem";

const datUI = new dat.GUI({name: "Debug"})

export {datUI}

export default class MainScene extends Container{
    /**
     * Escena inicial
     *
     * @param {Application} app
     */
    constructor(app) {
        super()
        app.stage.addChild(this)

        const brena = new SVG(brena_district)
        const perimeter = new SVG(lima_fencing_perimeter)
        const highway = new SVG(lima_fencing_highway)
        const majorRoads = new SVG(lima_fencing_major_roads)
        const roads = new SVG(lima_fencing_roads)

        const input = new Input(app.view)

        brena.position.set(355, 245)

        this.addChild(brena)
        this.addChild(perimeter)
        this.addChild(highway)
        this.addChild(majorRoads)
        this.addChild(roads)

        GridAPI.init(this, {
            gizmos: true
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

    static init (app) {
        return new MainScene(app)
    }
}
