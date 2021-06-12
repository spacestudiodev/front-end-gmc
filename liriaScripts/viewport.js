import {Viewport} from 'pixi-viewport'

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

    return viewport
}

export function getViewport() {
    return viewport
}

export default {
    createRenderer: createViewportRenderer,
    get: getViewport
}
