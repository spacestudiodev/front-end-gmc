import * as PIXI from 'pixi.js'
import BatchRendering from './batchRendering'
import FixedZoomContainer from './fixedZoomContainer'
import {getViewport} from './viewport'

const WIDTH = 54

export default class AvenuesNames extends PIXI.Container {
    static main

    constructor() {
        super()
        AvenuesNames.main = this
        this.viewport = getViewport()
        this.renderer = PIXI.autoDetectRenderer()

        this.avenues = undefined
        this.sheet = undefined

        const loader = PIXI.Loader.shared

        loader.onComplete.add(() => {
            this.sheet = loader.resources["map/allText.json"]
        })

        fetch("/map/json/avenues_names_by_grid.json")
            .then(response => response.json())
            .then(json => {
                this.avenues = json
            })

        this.batchRender = new BatchRendering()
        this.addChild(this.batchRender.container)
    }

    isLoaded() {
        return this.avenues !== undefined
    }

    containInPos(pos) {
        return this.avenues ? this.avenues[pos] ? true : false : false
    }

    create(pos) {
        const cont = new PIXI.Container()
        const item = this.avenues[pos]

        for (let i = 0, len = item.length; i < len; i = i + 4) {
            const fixCont = new FixedZoomContainer(0.9)
            const [text, x, y, r] = item.slice(i, i + 4)

            const sprite = new PIXI.Sprite(this.sheet.textures[text + ".png"])

            fixCont.addChild(sprite)
            fixCont.x = x
            fixCont.y = y
            fixCont.rotation = r
            sprite.anchor.set(0.5, 1)
            fixCont.scale.x = fixCont.scale.y = 1 / this.viewport.scaled

            cont.addChild(fixCont)
        }

        return cont
    }
}
