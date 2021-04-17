import Liria from "."
import Component from "./component"
import Vector2 from "./vector2"

export default class Transform extends Component {
    init() {
        this.liria = Liria.get()

        this._worldPosition = new Vector2()

        Object.defineProperty(this, "worldPosition", {
            get: () => { 
                const worldPos = new Vector2(this.liria.cameraPosition.x, this.liria.cameraPosition.y)
                const worldZoom = this.liria.worldZoom
                const pos = this.position
                worldPos.x += pos.x * worldZoom * this.scale.x
                worldPos.y += pos.y * worldZoom * this.scale.y
                return worldPos
            }
        })

        this._worldScale = new Vector2()
        Object.defineProperty(this, "worldScale", {
            get: () => {
                const worldZoom = this.liria.worldZoom
                const result = new Vector2(this.scale.x * worldZoom, this.scale.y * worldZoom)
                return result
            }
        })

        this._position = new Vector2()
        Object.defineProperty(this, "position", {
            get: () => {
                let result = Vector2.clone(this._localPosition)
                
                if(this.parent) {
                    const parentPos = this.parent.transform.position
                    result = new Vector2(parentPos.x + result.x, parentPos.y + result.y)
                }

                return Object.freeze(result)
            },
            set: v => {
                this._position = new Vector2(v.x, v.y)
                this._localPosition = new Vector2(v.x, v.y)
                if(this.parent) {
                    const parentPos = this.parent.transform.position
                    this._localPosition = new Vector2(this._position.x - parentPos.x, this._position.y - parentPos.y)
                }
            }
        })

        this._localPosition = new Vector2()
        Object.defineProperty(this, "localPosition", {
            get: () => Object.freeze({ ...this._localPosition }),
            set: v => {
                this._localPosition = new Vector2(v.x, v.y)
            }
        })

        this._scale = new Vector2(1, 1)
        Object.defineProperty(this, "scale", {
            get: () => {
                let result = new Vector2(this._localScale.x, this._localScale.y)

                if(this.parent) {
                    const parentScale = this.parent.transform.scale
                    result = new Vector2(parentScale.x * result.x, parentScale.y * result.y)
                }

                return Object.freeze(result)
            },
            set: v => {
                this._scale = new Vector2(v.x, v.y)
                this._localScale = new Vector2(this._scale.x, this._scale.y)
                if(this.parent) {
                    const parentScale = this.parent.transform.scale
                    this._localScale = new Vector2(this._scale.x - parentScale.x, this._scale.y - parentScale.y)
                }
            }
        })

        this._localScale = new Vector2(1, 1)
        Object.defineProperty(this, "localScale", {
            get: () => Object.freeze({ ...this._localScale }),
            set: v => {
                this._localScale = new Vector2(v.x, v.y)
            }
        })

        this._parent = undefined
        Object.defineProperty(this, "parent", {
            get: () => this._parent,
            set: v => {
                if(this._parent) {
                    const childs = this.parent._childs
                    const index = childs.indexOf(this.node)
                    if(index !== -1)
                        childs.splice(index, 1)
                }

                if(v){
                    const childs = v._childs
                    childs.push(this.node)
                }

                this._parent = v
            }
        })

        this.pivot = new Vector2(0.5, 0.5)
        this.anchor = new Vector2(0.5, 0.5)
    }
}
