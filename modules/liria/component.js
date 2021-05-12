import Liria from "."

export default class Component {
    _init(node) {
        this.node = node
        this.liria = Liria.get()
        this.transform = this.node.transform
        this.enable = true
        
        this.init()
    }

    // Se llama al crear el componente y es agregado a la scena
    init() { }

    // Esta accion se llama desde el nucleo
    _render() {
        if(!this._firstFrame){
            this._firstFrame = true
            this.start()
        } else this.update()
    }

    _draw() {
        this.draw()
    }

    draw() {  }

    // Se llama antes del update
    start() { }
    // Se llama a esta funcion en cada Frame
    update() { }
    
    _dispose() {
        this.destroy()
    }

    // Se llama a esta funcion al destruir el componente
    destroy() { 
        
    }
}
