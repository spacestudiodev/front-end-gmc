import * as PIXI from 'pixi.js'
import Camera from "../modules/liria/camera"
import Input from "../modules/liria/input"
import Vector2 from "../modules/liria/vector2"
import ElementNode from './elementNode'
import GridAPI from './gridAPI'

const SIMULE_WIDTH = 400
const SIMULE_HEIGHT = 200

export default class PaintSprites {
    size = 0.2
    position = new Vector2()
    curr = 0

    constructor(container) {
        this.curr = 0

        this.elements = [
            ElementNode.from("../map/housegroup.png"),
            ElementNode.from("../map/treegroup.png"),
            ElementNode.from("../map/bighouseyellow.png"),
            ElementNode.from("../map/bighousewhite.png"),
            ElementNode.from("../map/captus.png"),
        ]

        this.elements.forEach(e => {
            e.visible = false
            container.addChild(e)
            e.anchor.x = 0.5
            e.anchor.y = 0.5
        })

        this.elements[this.curr].visible = true
        this.container = container

        Input.onKeyDown(this.onKeyDown.bind(this))

        // --- DEBUG ---
        // --- Dibujo de camara simulada ---
        this.cameraDraw = new PIXI.Graphics()
        this.cameraDraw.lineStyle(2, 0xF70000)
        this.cameraDraw.drawRect(
            SIMULE_WIDTH, SIMULE_HEIGHT, 
            window.innerWidth - SIMULE_WIDTH * 2,
            window.innerHeight - SIMULE_HEIGHT * 2)
        container.parent.addChild(this.cameraDraw)
        // --- ---
    }

    update() {
        const curr = this.elements[this.curr]
        const pos = Camera.main.screenToWorldPos(Input.mousePosition)
        curr.scale.x = this.size
        curr.scale.y = this.size
        curr.position.set(pos.x, pos.y)

        const camPos = Camera.main.cameraPosition
        const worldZoom = Camera.main.worldZoom

        const from = new Vector2(
            (camPos.x - SIMULE_WIDTH) * -1 / worldZoom, 
            (camPos.y - SIMULE_HEIGHT) * -1 / worldZoom)
        const to = new Vector2(
            camPos.x - window.innerWidth + SIMULE_WIDTH, 
            camPos.y - window.innerHeight + SIMULE_HEIGHT)

        to.x = to.x * -1 / worldZoom
        to.y = to.y * -1 / worldZoom

        GridAPI.updateGizmos(Camera.main.zPos, from, to)
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

        if (e.key === "q")
            this.size -= 0.01
        else if (e.key === "w")
            this.size += 0.01

        if (e.key === " ") {
            const sprite = ElementNode.clone(this.elements[this.curr])
            this.container.addChild(sprite)
            const pos = Camera.main.screenToWorldPos(Input.mousePosition)
            sprite.anchor.x = 0.5
            sprite.anchor.y = 0.5
            sprite.scale.x = this.size
            sprite.scale.y = this.size
            sprite.position.set(pos.x, pos.y)

            GridAPI.addElement({
                id: this.curr, 
                position: {x: pos.x, y: pos.y},
                scale: this.size,
            }, Camera.main.zPos, pos)
        }

        if (e.key === "e") {
            GridAPI.printLayers()
        }
    }
}
