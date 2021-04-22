import Node from './node'
import Camera from './camera'
import Input from './Input'
import Vector2 from './vector2'

export default class Liria {
    static get() {
        const liria = this.main

        if(!liria) 
            console.error("No se ha iniciado Liria") 

        return liria
    }

    static set(target) {
        this.main = target
    }

    nodes = []
    endUpdateNodes = []
    cameraPosition = new Vector2()

    worldZoom = 1
    zPos = 0

    constructor(canvas, ctx, settings = {}) {
        if(!ctx) {
            console.error("No se asigno un contexto a Liria. Abortando...")
            return
        }

        Liria.set(this)

        this.ctx = ctx
        this.canvas = canvas

        this._systemNode = new Node()
        this._systemNode.addComponent(new Input())
        this._systemNode.addComponent(new Camera())

        this.addNode(this._systemNode)
    }

    render() {
        this._runAllNodes(node => node._render())
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this._runAllNodes(node => node._draw())
    }

    addNode(node){
        this.nodes.push(node)
        node._init()
    }

    _runAllNodes(func){
        for (let node of this.nodes) {
            func(node)
        }
    }

    screenToWorldPos(pos) {
        const worldPos = this.cameraPosition

        const width = this.canvas.width
        const height = this.canvas.height

        const cWidth = width / this.worldZoom
        const cHeight = height / this.worldZoom

        const relativePos = new Vector2(pos.x / width, pos.y / height)
        relativePos.x = relativePos.x * cWidth + worldPos.x * -1 / this.worldZoom
        relativePos.y = relativePos.y * cHeight + worldPos.y * -1 / this.worldZoom

        return relativePos
    }

    dispose() {
        this._runAllNodes(node => node._dispose())
    }
}

