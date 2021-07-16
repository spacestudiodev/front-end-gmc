import * as PIXI from 'pixi.js'
import LiriaComponent from './classes/liriaComponent'
import ElementNode, {elementsDefault} from './elementNode'
import GridAPI from './gridAPI'

export default class DrawSystem extends LiriaComponent {
    /** @typeof {DrawSystem}*/
    static main

    constructor() {
        super()
        DrawSystem.main = this
        this.buffer = new BufferSystem()
        this.ids = {}
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

    add(li, x, y) {
        const elements = GridAPI._getSquare(li, x, y)
        for (let i = 0; i < elements.length; i = i + 5) {
            const elid = elements[i]
            const xpos = elements[i + 1]
            const ypos = elements[i + 2]
            const scale = elements[i + 3]

            const dataBuff = this.buffer.use(elid, this)
            dataBuff.el.position.set(xpos, ypos)
            dataBuff.el.scale.x = dataBuff.el.scale.y = scale
            dataBuff.el.visible = true
            dataBuff.el.interactive = false

            const path = `${li}.${x}.${y}`
            if (!this.ids[path]) this.ids[path] = []
            this.ids[path].push({elid: dataBuff.elid, id: dataBuff.id})
        }
    }

    delete(li, x, y) {
        const idate = this.ids[`${li}.${x}.${y}`]

        if (idate) {
            for (let i = 0; i < idate.length; i++) {
                this.buffer.restore(idate[i].elid, idate[i].id)
            }
            this.ids[`${li}.${x}.${y}`] = []
        }
    }

    addSingle(li, x, y, elid, xpos, ypos, size) {
        const dataBuff = this.buffer.use(elid, this)
        dataBuff.el.position.set(xpos, ypos)
        dataBuff.el.scale.x = dataBuff.el.scale.y = scale
        dataBuff.el.visible = true
        dataBuff.el.interactive = false

        const path = `${li}.${x}.${y}`
        if (!this.ids[path]) this.ids[path] = []
        this.ids[path].push({elid: dataBuff.elid, id: dataBuff.id})
        return dataBuff.id
    }

    deleteSingle(li, x, y, elid, id) {
        const idate = this.ids[`${li}.${x}.${y}`]

        if (idate) {
            this.buffer.restore(elid, id)
        }
    }
}

class BufferSystem {
    constructor() {
        this.queue = {}
        this.inUse = {}
        this.ids = []
        this.count = 0
    }

    restore(elid, id) {
        if (this.inUse[id]) {
            this.inUse[id].visible = false
            this.inUse[id].interactive = false
            this.queue[elid].push(this.inUse[id])
            delete this.inUse[id]
        }
        this.ids.push(id)
    }

    use(elid, cont) {
        if (this.ids.length === 0) this.ids.push(this.count++)
        let id = this.ids[0]

        if (!this.queue[elid]) this.queue[elid] = []

        if (this.queue[elid].length === 0)
            this.queue[elid].push(this.createNewElement(elid, cont))

        const el = this.inUse[id] = this.queue[elid][0]

        this.queue[elid].splice(0, 1)
        this.ids.splice(0, 1)

        return {id, elid, el}
    }

    createNewElement(id, cont) {
        const el = ElementNode.clone(elementsDefault[id])
        cont.addChild(el)
        el.anchor.x = 0.5
        el.anchor.y = 0.5
        el.visible = false
        return el
    }
}
