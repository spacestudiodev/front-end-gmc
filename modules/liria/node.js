import Transform from "./transfrom"

export default class Node {
    _components = []
    _childs = []

    _init() {
        this.transform = new Transform()
        this.addComponent(this.transform)
        this.init()
    }

    init() {  }

    addComponent(comp) {
        this._components.push(comp)
        comp._init(this)
    }

    addChild(node) {
        node.transform.parent = this
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
            func(comp)
    }

    _runAllNodes(func) {
        for (let node of this._childs)
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

