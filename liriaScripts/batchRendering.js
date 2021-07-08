import * as PIXI from 'pixi.js'
import {getViewport} from './viewport'

export default class BatchRendering {
    static main
    constructor() {
        BatchRendering.main = this
        this.renderer = PIXI.autoDetectRenderer()
        this.viewport = getViewport()

        this.pendingQueue = []
        this.renderQueue = []
        this.isRendering = false
        this.isPending = false
        this.toRenderCont = undefined
        this.container = new PIXI.Container()
    }

    render() {
        if (!this.isRendering)
            this._prepareRender()
        else {
            this._renderBatch()
            this.viewport.dirty = true
        }

    }

    _prepareRender() {
        if (this.pendingQueue.length === 0) return

        this.renderQueue = [...this.pendingQueue]
        this.toRenderCont = new PIXI.Container()
        this.isRendering = true
        this.pendingQueue = []
    }

    add(el) {
        this.pendingQueue.push(el)
    }

    _renderBatch() {
        let i = 5

        while (i--) {
            if (this.renderQueue.length === 0) break
            const item = this.renderQueue.pop()

            this.toRenderCont.addChild(item())

            if (this.renderQueue.length === 0) {
                if (!this.toRenderCont) console.log("es indefinido")
                this.renderer.plugins.prepare.upload(this.toRenderCont, () => {
                    this.container.addChild(this.toRenderCont)
                    this.isRendering = false
                })
            }
        }
    }
}
