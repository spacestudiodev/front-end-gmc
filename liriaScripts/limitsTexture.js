import * as PIXI from 'pixi.js'
import LiriaComponent from './classes/liriaComponent'
import {SVG} from '../modules/pixi-svg'
import GridAPI from './gridAPI'
import {AdjustmentFilter} from '@pixi/filter-adjustment'
import {getViewport} from './viewport'
import {lerp} from '../modules/liria/mathHelper'

export default class LimitsTexture extends LiriaComponent {
    constructor(mask, mapDisable) {
        super()
        this.loader.add("map/limaTexture.jpg")
        this.loader.add("map/alllimitations.json")
        this.mask = mask
        this.mapDisable = mapDisable
        this.layer = 0
        this.viewport = getViewport()
        this.filter = new AdjustmentFilter({
            saturation: 0.4,
        })
        this.mapDisable.filters = [this.filter]

        GridAPI.main.on("zoomChange", this.onGridZoomChange.bind(this))
    }

    onGridZoomChange(layer) {
        this.layer = layer
    }

    onLoadComplete() {
        // Textura principal
        const texture = this.loader.resources["map/limaTexture.jpg"].texture
        const sprite = new PIXI.Sprite(texture)
        sprite.position.set(232.075, -587.648)
        sprite.scale.set(6.95, 6.95)
        sprite.mask = this.mask
        this.mapDisable.addChild(sprite)

        // Pintar limites
        const sheet = this.loader.resources["map/alllimitations.json"]
        const json = sheet.data.frames
        const keys = Object.keys(json)
        for (let i = 0, len = keys.length; i < len; i++) {
            if(keys[i] !== "losolivos.png") continue

            const el = json[keys[i]]
            const x = el.pos[0] + 232.075 + 6.5
            const y = el.pos[1] - 587.648 + 8
            const sprite = new PIXI.Sprite(sheet.textures[keys[i]])
            sprite.x = x
            sprite.y = y
            sprite.scale.set(2, 2)

            //sprite.visible = false

            this.addChild(sprite)
        }
    }

    update() {
        const to = this.layer === 1 ? 0.4 : 1
        this.filter.saturation = lerp(this.filter.saturation, to, 0.1)
        if(this.filter.saturation !== to) this.viewport.dirty = true
    }
}
