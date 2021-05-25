import * as PIXI from "pixi.js"
import PaintSprites from "./paintSprites"
import {OutlineFilter} from "pixi-filters"
import {lerp} from "../modules/liria/mathHelper"

export default class ElementNode extends PIXI.Sprite {
    constructor(texture, interactive = false) {
        super(texture)
        this.nextScale = undefined
        this.on("pointerdown", this.select.bind(this))
        this.on("pointerover", this.onpointerover.bind(this))
        this.on("pointerout", this.onpointerout.bind(this))
        this.interactive = interactive
        this.foutline = new OutlineFilter(2, 0x99ff99)
    }

    updateTransform() {
        if(!this.nextScale) this.nextScale = this.scale.x
        this.scale.x = this.scale.y = lerp(this.scale.x, this.nextScale, 0.2)
        super.updateTransform()
    }

    setScale(scale) {
        this.scale.x = this.scale.y = this.nextScale = scale
    }

    /**
     * [DEBUG]
     * Se llama cuando se clickea el objeto
     * [--]
     */
    select() {
        if (PaintSprites.canScale) {
            this.nextScale += PaintSprites.sizeToScale
        }
    }

    onpointerover() {
        this.filters = PaintSprites.canScale ? [this.foutline] : []
    }

    onpointerout() {
        this.filters = []
    }

    /**
     * Clona un elemento
     *
     * @param {PIXI.Sprite} sprite
     * @param {boolean} interactive
     */
    static clone(sprite, interactive = false) {
        return new ElementNode(sprite.texture, interactive)
    }

    /**
     * Crea un elemento con la ruta de una imagen
     *
     * @param {string} texturePath
     * @param {boolean} interactive
     */
    static from(texturePath, interactive = false) {
        return new ElementNode(new PIXI.Texture.from(texturePath), interactive)
    }
}

export const elementsDefault = [
    ElementNode.from("../map/housegroup.png"),
    ElementNode.from("../map/treegroup.png"),
    ElementNode.from("../map/bighouseyellow.png"),
    ElementNode.from("../map/bighousewhite.png"),
    ElementNode.from("../map/captus.png"),
    ElementNode.from("../map/edificiowhite.png"),
]
