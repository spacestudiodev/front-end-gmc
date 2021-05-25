import {Application} from "@pixi/app";
import {Container} from "@pixi/display"

import dat from 'dat.gui'

import {SVG} from '../modules/pixi-svg'
import Camera from "../modules/liria/camera"
import Input from "../modules/liria/input"
import GridAPI from "./gridAPI"
import PaintSprites from "./paintSprites"
import DrawSystem from "./drawSystem"
/*
import lima_fencing from '../districtsMaps/lima_fencing'
import mainAvenues from '../districtsMaps/main_avenues'
import brena from '../districtsMaps/brena'
import callao from '../districtsMaps/callao'
import lapunta from '../districtsMaps/lapunta'
import bellavista from "../districtsMaps/bellavista"
import ate from "../districtsMaps/ate"
import jesusmaria from "../districtsMaps/jesusmaria"
import barranco from "../districtsMaps/barranco"
import comas from "../districtsMaps/comas"
import el_agustino from "../districtsMaps/el_agustino"
import independencia from "../districtsMaps/independencia"
*/
import all_roads from "../districtsMaps/all_roads";

const datUI = new dat.GUI({name: "Debug"})

export {datUI}

export default class MainScene extends Container {
    /**
     * Escena inicial
     *
     * @param {Application} app
     */
    constructor(app) {
        super()
        app.stage.addChild(this)

        const mainMap = new Container()
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






