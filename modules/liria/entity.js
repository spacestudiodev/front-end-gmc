import Transform from "./transfrom";

export default class Entity {
    components = []
    transform = {}

    init() {
        this.transform = addComponent(new Transform())
    }

    addComponent(component) {
        component.init()
        this.components.push(component)
        return component
    }
}
