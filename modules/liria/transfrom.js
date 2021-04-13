import Component from "./component";
import Vector2 from "./vector2";

export default class Transform extends Component {
    init() {
        this._worldPosition = new Vector2()
        
        this.parent = undefined

        this.position = new Vector2()
        this.localPosition = new Vector2()
        this.scale = new Vector2()
        this.localScale = new Vector2()

        this.pivot = new Vector2()
        this.anchor = new Vector2()
    }
}
