import {lerp} from "./mathHelper"

export default class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    static zero() {
        return new Vector2(0, 0)
    }

    static lerp(val, to, i) {
        return new Vector2(lerp(val.x, to.x, i), lerp(val.y, to.y, i))
    }

    static clone(vector) {
        return new Vector2(vector.x, vector.y)
    }

    static distance(p1, p2) {
        return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2))
    }

    isEqual(to) {
        return this.x === to.x && this.y === to.y
    }
}
