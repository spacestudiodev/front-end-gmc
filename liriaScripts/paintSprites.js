import * as PIXI from 'pixi.js'
import Camera from "../modules/liria/camera"
import Input from "../modules/liria/Input"
import Vector2 from "../modules/liria/vector2"

export default class PaintSprites {
    size = 0.2
    position = new Vector2()
    curr = 0

    layers = {}

    constructor(container) {
        this.cwidth = container.width
        this.cheight = container.height

        this.debug = new PIXI.Text("", {fontSize: 14})
        this.debug.position.set(300, 0)
        container.parent.addChild(this.debug)
        this.debugText = ""

        this.layers = {
            "1": {
                sizeX: 12,
                sizeY: 8,
                container: undefined,
                grid: []

            },
            "2": {
                sizeX: 24,
                sizeY: 16,
                container: undefined,
                grid: []
            }
        }

        this.lastLn = undefined

        this.layerCont = new PIXI.Container()
        container.addChild(this.layerCont)
        
        Object.keys(this.layers).forEach((key) => {
            const layer = this.layers[key]

            const cont = new PIXI.Container()
            cont.visible = false
            
            this.layerCont.addChild(cont)

            layer.container = cont

            for (let x = 0; x < layer.sizeX; x++) {
                for (let y = 0; y < layer.sizeY; y++) {
                    layer.grid[x + y * layer.sizeX] = []
                }
            }
        })
        
        this.lines = new PIXI.Graphics()
        this.lines.lineStyle(1, 0x000000, 0.13)

        container.addChild(this.lines)

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

        this.drawGrid()

        const currLayer = this.layers[this.lastLn]

        const camPos = Camera.main.cam.position
        const worldZoom = Camera.main.cam.scale.x
        const pos1 = new Vector2()

        pos1.x = camPos.x * -1 / worldZoom / this.cwidth * currLayer.sizeX
        pos1.y = camPos.y * -1 / worldZoom / this.cheight * currLayer.sizeY

        const pos2 = new Vector2(camPos.x - window.innerWidth, camPos.y - window.innerHeight)

        pos2.x = pos2.x * -1 / worldZoom / this.cwidth * currLayer.sizeX
        pos2.y = pos2.y * -1 / worldZoom / this.cheight * currLayer.sizeY

        this.printDebug(`Cam Grid Position (${parseInt(pos1.x)}, ${parseInt(pos1.y)})`)
        this.printDebug(`Cam Grid Position (${parseInt(pos2.x)}, ${parseInt(pos2.y)})`)

        this.debug.text = this.debugText
        this.debugText = ""
    }

    drawGrid() {
        const zoom = Camera.main.cam.scale.x
        const ln = this.getLayer(zoom)

        if(ln && this.lastLn !== ln){
            const currLayer = this.layers[ln]

            if(!currLayer) return
            
            if(this.lastLn) {
                this.layers[this.lastLn].container.visible = false

                this.lines.clear()
                this.lines.lineStyle(1, 0x000000, 0.13)
            }

            const mwidth = this.cwidth / currLayer.sizeX
            const mheight = this.cheight / currLayer.sizeY

            for (let x = 0; x < currLayer.sizeX; x++)
                for(let y = 0; y < currLayer.sizeY; y++)
                    this.lines.drawRect(x * mwidth, y * mheight, mwidth, mheight)

            currLayer.container.visible = true

            this.lastLn = ln
        }
    }

    getLayer(zoom) {
        if(zoom < 4.2) return "1"
        else if (zoom < 9) return "2"
        else return "3"
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
