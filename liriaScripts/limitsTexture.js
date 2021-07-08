import * as PIXI from 'pixi.js'
import LiriaComponent from './classes/liriaComponent'

export default class LimitsTexture extends LiriaComponent {
    constructor(mask) {
        super()
        this.loader.add("map/limaTexture.jpg")
        this.mask = mask
    }

    onLoadComplete() {
        const texture = this.loader.resources["map/limaTexture.jpg"].texture
        const sprite = new PIXI.Sprite(texture)
        this.addChild(sprite)
    }
}
