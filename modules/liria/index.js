import Camera from './camera'
import Input from './Input'
import Component from './component'
import Vector2 from './vector2'

export { Camera, Input, Component, Vector2 }

export default class Liria {
    constructor(settings = {}) {
        this.components = []

        this.addComponent(new Input())
        this.addComponent(new Camera())
        
        this.position = new Vector2()
        this.zoom = new Vector2()
    }

    render() {
        this._runAllComponents(comp => comp._render())
    }

    addComponent(node){
        this.components.push(node)
        node.init()
    }

    _runAllComponents(func){
        for (let comp of this.components)
            func(comp)
    }

    dispose() {
        this._runAllComponents(comp => comp._dispose())
    }
}

