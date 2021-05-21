import * as PIXI from 'pixi.js'
import ElementNode, {elementsDefault} from './elementNode'

export default class DrawSystem extends PIXI.Container {
    /** @typeof {DrawSystem}*/
    static main

    constructor() {
        super()
        DrawSystem.main = this
        this.buffer = new BufferSystem()
    }

    /**
     * draw.
     *
     * @param {Array} grid
     */
    draw(grid) {
        grid.forEach(g => {
            const {elements, position} = g
            for (let i = 0; i < elements.length; i = i + 5) {
                const elid = elements[i]
                const x = elements[i + 1]
                const y = elements[i + 2]
                const scale = elements[i + 3]

                const data = this.buffer.use(elid, this)
                console.log(data)
                data.el.position.set(x, y)
                data.el.scale.x = data.el.scale.y = scale
                data.el.visible = true
            }
        })
    }
}

class BufferSystem {
    constructor() {
        this.queue = {}
        this.inUse = {}
        this.count = 0
    }

    restore(elid, id) {
        this.queue[elid][id] = this.inUse[id]
        delete this.inUse[id]
    }

    use(elid, cont) {
        let id = 0
        if (!this.queue[elid]) this.queue[elid] = {}

        if (Object.keys(this.queue[elid]).length === 0) {
            this.queue[elid][this.count + 1] = this.createNewElement(elid, cont)
            id = this.count
        }

        const el = this.inUse[id] = this.queue[elid][id]
        delete this.queue[elid][id]

        return {id, elid, el}
    }

    createNewElement(id, cont) {
        this.count++
        const el = ElementNode.clone(elementsDefault[id])
        cont.addChild(el)
        el.anchor.x = 0.5
        el.anchor.y = 0.5
        el.visible = false
        return el
    }
}
