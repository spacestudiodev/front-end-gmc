import Node from "../modules/liria/node"
import MapNode from "./mapNode"

export default class MainScene extends Node {
    init() {
        this.addChild(new MapNode())
    }
}
