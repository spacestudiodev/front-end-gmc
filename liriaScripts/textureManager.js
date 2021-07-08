import * as PIXI from 'pixi.js'
import Input from '../modules/liria/input'
import Vector2 from '../modules/liria/vector2'
import CameraSystem from './cameraSystem'
import LiriaComponent from './classes/liriaComponent'
import {getViewport} from './viewport'

const WIDTH = 4
const HEIGHT = 7

function isEqualFloat(value, compare) {
    return value.toFixed(4) === compare.toFixed(4)
}

export default class TextureManager extends LiriaComponent {
    constructor(mask) {
        super()
        this.viewport = getViewport()

        this.textures = []
        this.texturesInUse = {}

        this.particleContainer = new PIXI.ParticleContainer(200, {
            scale: true,
            position: true,
            uvs: true
        })
        this.startPosition = new Vector2(232.075, -587.648)
        this.particleContainer.position.set(this.startPosition.x, this.startPosition.y)
        this.particleContainer.blendMode = PIXI.BLEND_MODES.MULTIPLY
        this.particleContainer.alpha = 0.8

        this.addChild(this.particleContainer)

        this.mask = mask

        this.texture = PIXI.Texture.from("map/texture.jpg")

        Input.onKeyDown(({key}) => {
            if (key === "n") {
                const relativePos = CameraSystem.main.screenToWorldPos(Input.mousePosition)
                this.startPosition.x = relativePos.x
                this.startPosition.y = relativePos.y
            }
        })
    }

    lastZoom = undefined
    lastPosition = undefined
    texturePosition = Vector2.zero()

    zoom(s, x, y, cont) {
        var worldPos = {x: (x - cont.x) / cont.scale.x, y: (y - cont.y) / cont.scale.y};
        var newScale = {x: s, y: s};

        var newScreenPos = {x: (worldPos.x) * newScale.x + cont.x, y: (worldPos.y) * newScale.y + cont.y};

        cont.x -= (newScreenPos.x - x);
        cont.y -= (newScreenPos.y - y);
        cont.scale.x = newScale.x;
        cont.scale.y = newScale.y;
    }

    lastFrom = undefined
    lastTo = undefined

    update() {
        const vp = this.viewport
        const pc = this.particleContainer
        const worldZoom = this.viewport.scaled
        const scale = 1 / worldZoom

        if (this.lastZoom && this.lastZoom !== worldZoom) {
            const relativePos = CameraSystem.main.screenToWorldPos(Input.mousePosition)
            this.zoom(scale, relativePos.x, relativePos.y, pc)
        }

        const from = new Vector2((vp.left - pc.x) * worldZoom, (vp.top - pc.y) * worldZoom)
        from.x = Math.floor((from.x + this.startPosition.x) / (1024 * 2)) - 1
        from.y = Math.floor((from.y + this.startPosition.y) / (1024 * 2))
        const to = new Vector2((vp.right - pc.x) * worldZoom, (vp.bottom - pc.y) * worldZoom)
        to.x = Math.ceil((to.x + this.startPosition.x) / (1024 * 2))
        to.y = Math.ceil((to.y + this.startPosition.y) / (1024 * 2))

        if (!this.lastFrom?.isEqual(from) || !this.lastTo?.isEqual(to)) {
            if (!this.lastFrom) this.lastFrom = from
            if (!this.lastTo) this.lastTo = to

            const nfrom = Vector2.zero()
            nfrom.x = from.x < this.lastFrom.x ? from.x : this.lastFrom.x
            nfrom.y = from.y < this.lastFrom.y ? from.y : this.lastFrom.y
            const nto = Vector2.zero()
            nto.x = to.x > this.lastTo.x ? to.x : this.lastTo.x
            nto.y = to.y > this.lastTo.y ? to.y : this.lastTo.y

            for (let x = nfrom.x; x <= nto.x; x++)
                for (let y = nfrom.y; y <= nto.y; y++) {
                    if (x >= from.x && x <= to.x && y >= from.y && y <= to.y) {
                        if (this.texturesInUse[x] && this.texturesInUse[x][y]) continue

                        let sprite = this.textures.pop()

                        if (!sprite){
                            sprite = PIXI.Sprite.from(this.texture)
                            pc.addChild(sprite)
                        }

                        sprite.scale.set(2, 2)
                        sprite.x = x * 1024 * 2
                        sprite.y = y * 1024 * 2
                        sprite.visible = true
                        this.texturesInUse[x] = {...this.texturesInUse[x], [y]: sprite}
                    } else {
                        let sprite = this.texturesInUse[x]

                        if(sprite)
                            sprite = sprite[y]
                        if(!sprite) continue

                        sprite.visible = false
                        this.textures.push(sprite)
                        delete this.texturesInUse[x][y]
                    }
                }

            this.lastFrom = from
            this.lastTo = to
        }
        this.lastZoom = worldZoom
    }
}
