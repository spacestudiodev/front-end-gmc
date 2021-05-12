import * as PIXI from "pixi.js"

export default class ElementNode extends PIXI.Sprite {
    constructor(texture) {
        super(texture)
    }

    /**
     * clone.
     *
     * @param {PIXI.Sprite} sprite
     */
    static clone(sprite) {
        return new ElementNode(sprite.texture)
    }

    static from(texturePath) {
        return new ElementNode(new PIXI.Texture.from(texturePath))
    }
}
