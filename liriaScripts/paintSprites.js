import * as PIXI from 'pixi.js'
import Camera from "../modules/liria/camera"
import Input from "../modules/liria/input"
import Vector2 from "../modules/liria/vector2"
import GridAPI from './gridAPI'

export default class PaintSprites {
    size = 0.2
    position = new Vector2()
    curr = 0

    constructor(container) {
        this.gridAPI = new GridAPI(container, {
            gizmos: true
        })

        this.debug = new PIXI.Text("", {fontSize: 14})
        this.debug.position.set(300, 0)
        container.parent.addChild(this.debug)
        this.debugText = ""

        this.lastLn = undefined

        this.layerCont = new PIXI.Container()
        container.addChild(this.layerCont)

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
            el.anchor.x = 0.5
            el.anchor.y = 0.5
        })

        this.sprites[this.curr].visible = true
        this.container = container

        Input.onKeyDown(this.onKeyDown.bind(this))
    }

    update() {
        const curr = this.sprites[this.curr]
        const pos = Camera.main.screenToWorldPos(Input.mousePosition)
        curr.scale.x = this.size
        curr.scale.y = this.size
        curr.position.set(pos.x, pos.y)

        const camPos = Camera.main.cameraPosition
        const worldZoom = Camera.main.worldZoom

        const from = new Vector2(camPos.x * -1 / worldZoom, camPos.y * -1 / worldZoom)
        const to = new Vector2(camPos.x - window.innerWidth, camPos.y - window.innerHeight)
        to.x = to.x * -1 / worldZoom
        to.y = to.y * -1 / worldZoom

        GridAPI.updateGizmos(Camera.main.zPos, from, to)
    }

    printDebug(string) {
        this.debugText += string + "\n"
    }

    onKeyDown(e) {
        if (e.key === "a" || e.key === "s") {
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

            this.sprites[this.curr].visible = true
        }

        if (e.key === "q")
            this.size -= 0.01
        else if (e.key === "w")
            this.size += 0.01

        if (e.key === " ") {
            const svg = new PIXI.Sprite(this.elements[this.curr])
            this.layers[this.lastLn].container.addChild(svg)
            const pos = Camera.main.screenToWorldPos(Input.mousePosition)
            svg.anchor.x = 0.5
            svg.anchor.y = 0.5
            svg.scale.x = this.size
            svg.scale.y = this.size
            svg.position.set(pos.x, pos.y)
        }
    }
}
