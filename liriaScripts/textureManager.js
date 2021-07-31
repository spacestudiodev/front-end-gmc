import * as PIXI from 'pixi.js'
import LiriaComponent from './classes/liriaComponent'
import {getViewport} from './viewport'

export default class TextureManager extends LiriaComponent {

    lastZoom = undefined
    lastX = 0
    lastY = 0

    constructor(mask) {
        super()
        this.viewport = getViewport()

        this.textures = []
        this.texturesInUse = {}

        this.mask = mask

        this.texture = PIXI.Texture.from("map/texture.jpg")
        this.tileSprite = new PIXI.TilingSprite(this.texture, window.innerWidth, window.innerHeight)
        this.tileSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY
        this.tileSprite.alpha = 0.8
        this.addChild(this.tileSprite)
        this.tilePosition = this.tileSprite.tilePosition
    }

    update() {
        const vp = this.viewport
        const worldZoom = this.viewport.scaled

        if (!this.lastZoom || this.lastZoom === worldZoom) {
            const deltaX = vp.left - this.lastX
            const deltaY = vp.top - this.lastY

            this.tilePosition.x -= deltaX * worldZoom
            this.tilePosition.y -= deltaY * worldZoom
        }

        this.lastX = vp.left
        this.lastY = vp.top

        this.lastZoom = worldZoom
    }
}
