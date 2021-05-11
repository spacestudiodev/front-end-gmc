import * as PIXI from 'pixi.js'
import Vector2 from "../modules/liria/vector2"

// Tamaño de la primera capa
const MAX_GRID_SIZE = 150
// Cantidad de capas
const LAYERS_COUNT = 4
// Diferencia del zoom entre capas
const ZOOM_DIF_LAYERS = 10
// Inicion del Zoom
const ZOOM_START = 0
// Area de la Grid
const AREA_GRID = new Vector2(1200, 700)

// -------
// Helper functions
// -------

function getMaxSize(bsize){
    return [
        Math.ceil(AREA_GRID.x / bsize), 
        Math.ceil(AREA_GRID.y / bsize)
    ]
}

function toPoinGrid(layer, from, to) {
    const bsize = getSizeByLayer(layer)

    const [xMax, yMax] = getMaxSize(bsize)

    const cwidth = bsize * xMax
    const cheight = bsize * yMax

    const fixPos = (pos, ceil = false) => {
        const _pos = new Vector2(pos.x / cwidth * xMax, pos.y / cheight * yMax)
        _pos.x = !ceil ? parseInt(_pos.x) : Math.ceil(_pos.x)
        _pos.y = !ceil ? parseInt(_pos.y) : Math.ceil(_pos.y)

        if (_pos.x < 0)
            _pos.x = 0
        if (_pos.x > xMax)
            _pos.x = xMax

        if (_pos.y < 0)
            _pos.y = 0
        if (_pos.y > yMax)
            _pos.y = yMax

        return _pos
    }

    return [fixPos(from), fixPos(to, true)] 
}

function getLayerByZoom(zoom) {
    return parseInt(zoom / ZOOM_DIF_LAYERS)
}

function getSizeByLayer(layer) {
    return MAX_GRID_SIZE / Math.pow(2, layer)
}

// -------
// Main Class
// -------

export default class GridAPI {
    static main

    constructor(container, settings = {}) {
        GridAPI.main = this

        this.layers = []
        this.settings = settings

        this.gizmos = new PIXI.Graphics()
        this.gizmos.lineStyle(1, 0x000000, 0.13)
        this.lastLayerN = undefined

        this.lastFrom = new Vector2(0, 0)
        this.lastTo = new Vector2(0, 0)

        container.addChild(this.gizmos)

        this.container = container
    }

    static init(container, settings = {}) {
        return new GridAPI(container, settings)
    }

    static getGrid(zoom, from, to) {
        const layer_n = getLayerByZoom(zoom)
        const [_from, _to] = toPoinGrid(layer_n, from, to)
        const [xMax] = getMaxSize(getSizeByLayer(layer_n))

        const result = []

        const draw = (x, y) => {
            const layers = GridAPI.main.layers 

            if(layers[layer_n])
                if(layers[layer_n][x + y * xMax])
                    return layers[layer_n][x + y * xMax]

            return []
        }

        for (let x = _from.x; x < _to.x; x++)
            for (let y = _from.y; x < _to.y; y++)
                result.push({
                    position: {x, y},
                    draw: draw(x, y) 
                })

        return result
    }

    static addElement(el, zoom, pos) {
    }

    static updateGizmos(zoom, from, to) {
        const main = this.main
        if (!main.settings.gizmos) return

        let layer_n = getLayerByZoom(zoom)

        if (layer_n > LAYERS_COUNT)
            layer_n = LAYERS_COUNT
        else if (layer_n < 0)
            layer_n = 0

        const bsize = getSizeByLayer(layer_n)

        const [_from, _to] = toPoinGrid(layer_n, from, to)

        const needDraw = main.lastLayerN !== layer_n
            || main.lastFrom.x !== _from.x || main.lastFrom.y !== _from.y
            || main.lastTo.x !== _to.x || main.lastTo.y !== _to.y

        if (needDraw) {
            main.gizmos.clear()
            main.gizmos.lineStyle(1.3 / Math.pow(1.05, zoom), 0x00ABE7, 1)

            //main.layers[zoom]?.container?.visible = true
            main.lastLayerN = layer_n
            main.lastFrom = _from
            main.lastTo = _to

            for (let x = _from.x; x < _to.x; x++)
                for (let y = _from.y; y < _to.y; y++)
                    main.gizmos.drawRect(x * bsize, y * bsize, bsize, bsize)
        }
    }
}
