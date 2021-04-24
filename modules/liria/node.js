import Transform from "./transfrom"

export default class Node {
    _components = []
    _childs = []

    _init() {
        this.transform = new Transform()
        this.addComponent(this.transform)
        this.init()
        this.enable = true
    }

    init() {  }

    addComponent(comp) {
        this._components.push(comp)
        if(comp._init)
        comp._init(this)
        return comp
    }

    addChild(node) {
        node._init()
        node.transform.parent = this
        return node
    }

    removeChild(node) {
        node.transform.parent = undefined
    }

    getComponent(type) {
        for (let cls of this._components)
            if(cls instanceof type)
                return cls
    }

    _runAllComponents(func) {
        for (let comp of this._components)
            if(comp.enable)
                func(comp)
    }

    _runAllNodes(func) {
        for (let node of this._childs)
            if(node.enable)
                func(node)
    }

    _render() {
        this._runAllComponents(comp => comp._render())
        this._runAllNodes(node => node._render())
    }

    _draw() {
        this._runAllComponents(comp => comp._draw())
        this._runAllNodes(node => node._draw())
    }

    _dispose() {
        this._runAllComponents(comp => comp._dispose())
        this._runAllNodes(node => node._dispose())
    }
}

