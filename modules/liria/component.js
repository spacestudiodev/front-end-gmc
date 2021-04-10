import {Input} from "."

export default class Component {
    // Se llama al crear el componente y es agregado a la scena
    init() { }

    // Esta accion se llama desde el nucleo
    _render() {
        if(!this._firstFrame){
            this._firstFrame = true
            this.start()
        } else this.update()
    }
    
    // Habilitar el OnKeyDown
    useKeyDown() {
        Input.addGetKeyDown(this.onKeyDown.bind(this))
    }

    // Habilitar el OnKeyUp
    useKeyUp() {
        Input.addGetKeyUp(this.onKeyUp.bind(this))
    }
    
    // Se llama antes del update
    start() { }
    // Se llama a esta funcion en cada Frame
    update() { }

    onKeyDown(e) { }
    onKeyUp(e) { }
    
    _dispose() {
        this.destroy()
    }

    // Se llama a esta funcion al destruir el componente
    destroy() { 
        
    }
}
