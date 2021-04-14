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

    constructor(ctx, settings = {}) {
        if(!ctx) {
            console.error("No se asigno un contexto a Liria. Abortando...")
            return
        }

        Liria.set(this)

        this.ctx = ctx
        this.canvas = ctx.canvas

        this._mainNode = new Node()
        this._mainNode.addComponent(new Input())
        this._mainNode.addComponent(new Camera())

        this.addNode(this._mainNode)

        this.worldPosition = new Vector2()
        this.worldZoom = 1
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

    dispose() {
        this._runAllNodes(node => node._dispose())
    }
}

