import Transform from "./transfrom";

export default class EntityNode {
    components = []
    transform = {}

    init() {
        this.transform = this.addComponent(new Transform())
    }

    addComponent(component) {
        component.init()
        this.components.push(component)
        return component
    }
}
