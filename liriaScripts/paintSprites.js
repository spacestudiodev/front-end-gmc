import Camera from "../modules/liria/camera"
import Input from "../modules/liria/input"
import Vector2 from "../modules/liria/vector2"
import ElementNode, {elementsDefault} from './elementNode'
import GridAPI from "./gridAPI"
import {datUI} from "./mainScene"

const BUFFER_HISTORY = 20

export default class PaintSprites {
    size = 0.2
    position = new Vector2()
    curr = 0

    constructor(container) {
        this.curr = 0
        this.history = []

        this.elements = elementsDefault

        this.elements.forEach(e => {
            e.visible = false
            container.addChild(e)
            e.anchor.x = 0.5
            e.anchor.y = 0.5
        })

        this.elements[this.curr].visible = true
        this.container = container

        Input.onKeyDown(this.onKeyDown.bind(this))

        this.debugFolder = datUI.addFolder("Paint")
        this.debugFolder.add(this, "size")
        this.debugFolder.open()
    }

    update() {
        const curr = this.elements[this.curr]
        const pos = Camera.main.screenToWorldPos(Input.mousePosition)
        curr.scale.x = this.size
        curr.scale.y = this.size
        curr.position.set(pos.x, pos.y)
    }

    printDebug(string) {
        this.debugText += string + "\n"
    }

    onKeyDown(e) {
        if (e.key === "a" || e.key === "s") {
            this.elements[this.curr].visible = false

            if (e.key === "a") {
                if (this.curr === 0)
                    this.curr = this.elements.length - 1
                else
                    this.curr--
            }

            if (e.key === "s") {
                if (this.curr + 1 > this.elements.length - 1)
                    this.curr = 0
                else
                    this.curr++
            }

            this.elements[this.curr].visible = true
        }

        if (e.key === "q") {
            this.size -= 0.01
            this.debugFolder.updateDisplay()
        }
        else if (e.key === "w") {
            this.size += 0.01
            this.debugFolder.updateDisplay()
        }

        if (e.key === "u") {
            const length = this.history.length
            if (length > 0) {
                const dataH = this.history[length - 1]
                GridAPI.removeElement(dataH)
                this.history.splice(length - 1, 1)
            }
        }

        if (e.key === " ") {
            const sprite = ElementNode.clone(this.elements[this.curr], true)
            this.container.addChild(sprite)
            const pos = Camera.main.screenToWorldPos(Input.mousePosition)
            sprite.anchor.x = 0.5
            sprite.anchor.y = 0.5
            sprite.scale.x = this.size
            sprite.scale.y = this.size
            pos.x = parseFloat(pos.x.toFixed(3))
            pos.y = parseFloat(pos.y.toFixed(3))
            sprite.position.set(pos.x, pos.y)

            const el = GridAPI.addElement({
                id: this.curr,
                pos: {x: pos.x, y: pos.y},
                scale: parseFloat(this.size.toFixed(2)),
                sprite: sprite,
            }, Camera.main.zPos, pos)

            this.history.push(el)

            if (this.history.length > BUFFER_HISTORY)
                this.history.splice(0, 1)
        }

        if (e.key === "e") {
            GridAPI.printLayers()
        }
    }
}
