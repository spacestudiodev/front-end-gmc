import Liria from ".";
import Component from "./component";

export default class DrawablePath extends Component {
    static renders = {}

    paths = []
    tag = ""

    constructor(pathsDraw, tag = "", settings = {}) {
        super()

        if(pathsDraw)
            this.createPath(pathsDraw)

        this.tag = tag

        this.quality = settings.quality ?? 1
        this.scale = settings.scale ?? 1
        this.width = settings.width
        this.height = settings.height
    }

    init() {
        this.ctx = Liria.get().ctx
        this.transform = this.node.transform
    }

    createPath(pathDraw) {
        if (Array.isArray(pathDraw))
            for (let path of pathDraw)
                this.createPath(path)

        this.paths.push(pathDraw)
    }

    draw() {
        if (this.tag !== "") {
            if (DrawablePath.renders[this.tag]) {
                let x = (0.5 + this.transform.worldPosition.x) | 0
                let y = (0.5 + this.transform.worldPosition.y) | 0

                this.ctx.drawImage(DrawablePath.renders[this.tag], x, y, 
                    this.transform.worldScale.x * this.width * this.scale, this.transform.worldScale.y * this.height * this.scale)

            } else {
                const canvas = document.createElement('canvas')
                canvas.width = this.width * this.quality
                canvas.height = this.height * this.quality
                const ctx = canvas.getContext('2d')
                this.drawPath(ctx)
                DrawablePath.renders[this.tag] = canvas
            }
        } else this.drawPath(this.ctx, true)
    }

    drawPath(ctx, withPos = false) {
        const position = this.transform.worldPosition
        const scale = this.transform.worldScale
        const wScale = this.liria.worldZoom

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

            nPath.addPath(new Path2D(path.path), withPos ? {
                a: scale.x,
                d: scale.y,
                e: position.x,
                f: position.y
            }: {
                a: this.quality,
                d: this.quality
            })

            if (path.fill)
                ctx.fill(nPath)
            if (path.stroke)
                ctx.stroke(nPath)
        }
    }
}
