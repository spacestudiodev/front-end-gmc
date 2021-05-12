import {lerp} from "./mathHelper"

export default class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    static lerp(val, to, i){
        return new Vector2(lerp(val.x, to.x, i), lerp(val.y, to.y, i))
    }
}
