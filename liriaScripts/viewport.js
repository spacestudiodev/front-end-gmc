import {Viewport} from 'pixi-viewport'
import ZoomLimits from './viewportplugins/zoomLimits'
import MoveLimits from './viewportplugins/moveLimits'

let viewport
export function createViewportRenderer(renderer) {
    viewport = new Viewport({
        interaction: renderer.plugins.interaction
    })

    window.onresize = () => {
        renderer.resize(window.innerWidth, window.innerHeight)
        viewport.resize(window.innerWidth, window.innerHeight)
    }
    
    viewport
        .drag()
        .decelerate({
            friction: 0.95,
            minSpeed: 0.1
        })
        .pinch()
        .wheel({
            smooth: 4
        })

    viewport.plugins.add("zoomLimits", new ZoomLimits(viewport))
    viewport.plugins.add("moveLimits", new MoveLimits(viewport, {
        left: 165,
        top: 2756,
        right: 5391,
        bottom: 8996
    }))
    return viewport
}

export function getViewport() {
    return viewport
}

export default {
    createRenderer: createViewportRenderer,
    get: getViewport
}
