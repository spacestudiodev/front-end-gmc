import * as PIXI from 'pixi.js'
import MainScene from '../mainScene'

export default class LiriaComponent extends PIXI.Container {
    constructor() {
        super()
        this.loader = PIXI.Loader.shared
        this.loader.onComplete.add(this.onLoadComplete.bind(this))
    }

    init(container) {
        if(!container) container = MainScene.main
        container.addChild(this)
        return this
    }

    onLoadComplete() {}
}
