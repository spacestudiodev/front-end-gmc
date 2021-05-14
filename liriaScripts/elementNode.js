import * as PIXI from "pixi.js"

export default class ElementNode extends PIXI.Sprite {
    constructor(texture, interactive = false) {
        super(texture)
        this.on("pointerdown", this.select.bind(this))
        this.interactive = interactive
    }

    updateTransform() {
        super.updateTransform()
    }

    /**
     * [DEBUG]
     * Se llama cuando se clickea el objeto
     * [--]
     */
    select() {

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
