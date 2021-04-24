import * as PIXI from 'pixi.js'
import Camera from "../modules/liria/camera"
import Input from "../modules/liria/Input"
import Vector2 from "../modules/liria/vector2"

export default class PaintSprites {
    size = 0.2
    position = new Vector2()
    curr = 0

    constructor(container) {
        this.elements = [
            new PIXI.Texture.from("../map/housegroup.png"),
            new PIXI.Texture.from("../map/treegroup.png"),
            new PIXI.Texture.from("../map/bighouseyellow.png"),
            new PIXI.Texture.from("../map/bighousewhite.png"),
            new PIXI.Texture.from("../map/captus.png")
        ]

        this.sprites = []

        this.elements.forEach((e) => {
            const el = new PIXI.Sprite(e)
            el.visible = false
            container.addChild(el)
            this.sprites.push(el)
        })

        this.sprites[this.curr].visible = true
        this.container = container

        Input.onKeyDown(e => {
            if(e.key === "a" || e.key === "s") {
                this.sprites[this.curr].visible = false

                if (e.key === "a") {
                    if (this.curr === 0)
                        this.curr = this.sprites.length - 1
                    else
                        this.curr--
                }

                if (e.key === "s") {
                    if (this.curr + 1 > this.sprites.length - 1)
                        this.curr = 0
                    else
                        this.curr++
                }

                console.log(this.sprites, this.curr)

                this.sprites[this.curr].visible = true
            }

            if (e.key === "q")
                this.size -= 0.1
            else if(e.key === "w")
                this.size += 0.1

            if (e.key === " ") {
                const svg = new PIXI.Sprite(this.elements[this.curr])
                this.container.addChild(svg)
                const pos = Camera.main.screenToWorldPos(Input.mousePosition)
                svg.position.set(pos.x, pos.y)
                svg.scale.x = this.size
                svg.scale.y = this.size
            }
        })
    }
    
    update() {
        const curr = this.sprites[this.curr]
        const pos = Camera.main.screenToWorldPos(Input.mousePosition)
        curr.position.set(pos.x, pos.y)
        curr.scale.x = this.size
        curr.scale.y = this.size
    }
}
