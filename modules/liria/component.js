export default class Component {
    _init() {
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

    // Se llama antes del update
    start() { }
    // Se llama a esta funcion en cada Frame
    update() { }
    // Se llama al terminar el update de todos los items
    endUpdate() {  }
    
    _dispose() {
        this.destroy()
    }

    // Se llama a esta funcion al destruir el componente
    destroy() { 
        
    }
}
