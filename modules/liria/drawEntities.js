
import Liria from ".";
import Component from "./component";

export default class DrawEntities extends Component {
    static renders = []

    entities = []
    paths = []

    constructor(paths, tag, settings) {
        super()
        
        this.paths = paths
        this.tag = tag

        this.quality = settings.quality ?? 1
        this.scale = settings.scale ?? 1
        this.width = settings.width
        this.height = settings.height
    }

    init() {
        this.liria = Liria.get()
        this.canvas = this.liria.canvas
        this.ctx = this.liria.ctx

        if(this.tag !== "") {
            if (!DrawEntities.renders[this.tag])
                this.render = DrawEntities.renders[this.tag] = this.createRender()
            else this.render = DrawEntities.renders[this.tag]
        } else this.render = this.createRender()
    }

    createRender() {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = this.width * this.quality
        canvas.height = this.height * this.quality

        this.drawData(ctx)

        return ctx.getImageData(0, 0, canvas.width, canvas.height).data
    }

    drawData(ctx) {
        for (let path of this.paths) {
            const nPath = new Path2D()

            if(path.fill)
                if(typeof path.fill === "function")
                    path.fill()
                else
                    ctx.fillStyle = path.fill

            if (path.stroke)
                if(typeof path.stroke === "function")
                    path.stroke()
                else
                    ctx.strokeStyle = path.stroke

            if(path.lineWidth)
                ctx.lineWidth = path.lineWidth * wScale

            ctx.lineCap = path.lineCap ?? "butt"
            ctx.lineJoin = path.lineJoin ?? "butt"

            if(path.customColor)
                path.customColor(ctx)

            nPath.addPath(new Path2D(path.path), {
                a: this.quality,
                d: this.quality
            })

            if (path.fill)
                ctx.fill(nPath)
            if (path.stroke)
                ctx.stroke(nPath)
        }
    }

    addEntity(entity) {
        entity.init()
        this.entities.push(entity)
        return entity
    }

    draw() {
        const cvWidth = this.canvas.width, cvHeight = this.canvas.height,
            canvasData = this.ctx.createImageData(cvWidth, cvHeight),
            cData = canvasData.data

        const width = this.width * this.quality
        const height = this.height * this.quality
        
        let eLen = this.entities.length

        while (eLen--) {
            const i = this.entities.length - eLen
            const epos = this.entities[i-1].transform.worldPosition
            
            const w = width
            while (w--){
                const h = height
                while (h--) {
                    const rx = epos.x + w, ry = epos.y + h

                    if(rx < cvWidth && rx > 0 && ry < cvHeight && ry > 0) {
                        
                        var iData = (h * width + w) * 4
                        var pData = (~~ rx + ~~ ry * cvWidth) * 4

                        cData[pData] = this.render[iData]
                        cData[pData + 1] = this.render[iData + 1]
                        cData[pData + 2] = this.render[iData + 2]
                        
                        if (cData[pData + 3] < 100) {
                            cData[pData + 3] = this.render[iData + 3]
                        }

                        // http://jsfiddle.net/loktar/63QZz/
                    }
                }
            }
        }

        this.ctx.putImageData(canvasData, 0, 0)
    }
}
