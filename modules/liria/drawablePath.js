import Liria from ".";
import Component from "./component";

export default class DrawablePath extends Component {
    paths = []

    init() {
        this.ctx = Liria.get().ctx
        this.transform = this.node.transform
    }

    createPath(pathDraw) {
        this.paths.push(pathDraw)
    }

    draw() {
        for (let path of this.paths) {
            const nPath = new Path2D()

            if(path.fill)
                this.ctx.fillStyle = path.fill
            if (path.stroke)
                this.ctx.strokeStyle = path.stroke

            else if(path.customColor)
                path.customColor(this.ctx)

            nPath.addPath(new Path2D(path.path), {
                a: this.transform.worldScale.x,
                d: this.transform.worldScale.y,
                e: this.transform.worldPosition.x,
                f: this.transform.worldPosition.y
            })

            if (path.fill)
                this.ctx.fill(nPath)
            if (path.stroke)
                this.ctx.stroke(nPath)
        }
    }
}
