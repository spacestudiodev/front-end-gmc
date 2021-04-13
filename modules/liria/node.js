import Liria from "."
import Component from "./component"
import Transform from "./transfrom"

export default class Node {
    _components = []

    _init() {
        this.transform = new Transform()
        this.addComponent(this.transform)
    }

    addComponent(comp) {
        this._components.push(comp)
        comp._init()
    }

    addChild(node) {
        Liria.get().addNode(node)
        node.transform.parent = this
    }

    getComponent(type) {
        for (let cls of this._components)
            if(cls instanceof type)
                return cls
    }

    _runAllComponents(func) {
        for (let comp of this._components)
            func(comp)
    }

    _render() {
        this._runAllComponents(comp => comp._render())
    }

    _endUpdate() {
        this._runAllComponents(comp => comp.endUpdate())
    }

    _dispose() {
        this._runAllComponents(comp => comp._dispose())
    }
}

