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

    static getGrid(zoom, pos) {
    }

    static addElement(el, zoom, pos) {
    }

    static updateGizmos(zoom, from, to) {
        const main = this.main
        if (!main.settings.gizmos) return

        let layer_n = this._getLayerByZoom(zoom)

        if (layer_n > LAYERS_COUNT)
            layer_n = LAYERS_COUNT
        else if (layer_n < 0)
            layer_n = 0

        const bsize = MAX_GRID_SIZE / Math.pow(2, layer_n)
        const xMax = Math.ceil(AREA_GRID.x / bsize)
        const yMax = Math.ceil(AREA_GRID.y / bsize)

        const cwidth = bsize * xMax
        const cheight = bsize * yMax

        const _from = new Vector2(from.x / cwidth * xMax, from.y / cheight * yMax)
        _from.x = parseInt(_from.x)
        _from.y = parseInt(_from.y)

        if (_from.x < 0)
            _from.x = 0
        if (_from.x > xMax)
            _from.x = xMax

        if (_from.y < 0)
            _from.y = 0
        if (_from.y > yMax)
            _from.y = yMax

        const _to = new Vector2(to.x / cwidth * xMax, to.y / cheight * yMax)
        _to.x = Math.ceil(_to.x)
        _to.y = Math.ceil(_to.y)

        if (_to.x < 0)
            _to.x = 0
        if (_to.x > xMax)
            _to.x = xMax

        if (_to.y < 0)
            _to.y = 0
        if (_to.y > yMax)
            _to.y = yMax

        const needDraw = main.lastLayerN !== layer_n
            || main.lastFrom.x !== _from.x || main.lastFrom.y !== _from.y
            || main.lastTo.x !== _to.x || main.lastTo.y !== _to.y

        if (needDraw) {
            main.gizmos.clear()
            main.gizmos.lineStyle(1.3 / Math.pow(1.05, zoom), 0x000000, 0.13)

            //main.layers[zoom]?.container?.visible = true
            main.lastLayerN = layer_n
            main.lastFrom = _from
            main.lastTo = _to

            for (let x = _from.x; x < _to.x; x++)
                for (let y = _from.y; y < _to.y; y++)
                    main.gizmos.drawRect(x * bsize, y * bsize, bsize, bsize)
        }
    }

    static _getLayerByZoom(zoom) {
        return parseInt(zoom / ZOOM_DIF_LAYERS)
    }
}
