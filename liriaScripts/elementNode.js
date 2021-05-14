import * as PIXI from "pixi.js"

export default class ElementNode extends PIXI.Sprite {
    constructor(texture) {
        super(texture)
    }

    /**
     * Clona un elemento
     *
     * @param {PIXI.Sprite} sprite
     */
    static clone(sprite) {
        return new ElementNode(sprite.texture)
    }

    /**
     * Crea un elemento con la ruta de una imagen
     *
     * @param {string} texturePath
     */
    static from(texturePath) {
        return new ElementNode(new PIXI.Texture.from(texturePath))
    }
}
