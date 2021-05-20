import * as PIXI from 'pixi.js'
import Vector2 from "../modules/liria/vector2"
import {datUI} from './mainScene'
import brena from '../public/map/json/brena_full'

// Tamaño de la primera capa
const MAX_GRID_SIZE = 150
// Cantidad de capas
const LAYERS_COUNT = 2
// Diferencia del zoom entre capas
const ZOOM_DIF_LAYERS = 8
// Inicion del Zoom
const ZOOM_START = -1.5 * 6
// Area de la Grid
const AREA_GRID = new Vector2(1200, 700)
// Parametros
const PARAMS = {
    last_layer: 0,
}

// -------
// Helper functions
// -------

/**
 * Devuelve la cantidad de cuadros (X, Y) que componen la Grid
 * @param {Number} ssize
 */
function getLengthGrid(ssize) {
    return [
        Math.ceil(AREA_GRID.x / ssize),
        Math.ceil(AREA_GRID.y / ssize)
    ]
}

function getSquareSize(li = 0) {
    return MAX_GRID_SIZE / Math.pow(2, li)
}

function getNearestSquare(li, pos, end = false) {
    const ssize = getSquareSize(li)

    const [xlength, ylength] = getLengthGrid(ssize)

    const cwidth = ssize * xlength
    const cheight = ssize * ylength

    const _pos = new Vector2(pos.x / cwidth * xlength, pos.y / cheight * ylength)
    _pos.x = !end ? parseInt(_pos.x) : Math.ceil(_pos.x)
    _pos.y = !end ? parseInt(_pos.y) : Math.ceil(_pos.y)

    if (_pos.x < 0)
        _pos.x = 0
    if (_pos.x > xlength)
        _pos.x = xlength

    if (_pos.y < 0)
        _pos.y = 0
    if (_pos.y > ylength)
        _pos.y = ylength

    return _pos
}

// -------
// Main Class
// -------

export default class GridAPI {
    /** @type {GridAPI}*/
    static main

    constructor(container, settings = {}) {
        GridAPI.main = this

        this.layers = {...brena}
        this._sprites = {}

        this.settings = settings

        this.gizmos = new PIXI.Graphics()
        this.gizmos.lineStyle(1, 0x000000, 0.13)
        this.lastLn = undefined

        this.lastFrom = new Vector2(0, 0)
        this.lastTo = new Vector2(0, 0)

        container.addChild(this.gizmos)

        this.container = container
        this.debug = datUI.addFolder("Grid API")
        this.debug.open()

        this.debug.add(PARAMS, "last_layer").name("Current layer")
    }

    static init(container, settings = {}) {
        return new GridAPI(container, settings)
    }

    static _getSquare(li, x, y) {
        const [xlength] = getLengthGrid(getSquareSize(li))
        const result = []
        try {
            result = GridAPI.main.layers[li][x + y * xlength]
        } catch {}
        return result
    }

    static _addElementInSquare(li, x, y, el) {
        const [xlength] = getLengthGrid(getSquareSize(li))
        const layers = GridAPI.main.layers

        const ipos = x + y * xlength

        if (!layers[li]) layers[li] = {}
        const layer = layers[li]

        if (!layer[ipos]) layer[ipos] = []

        const id = layer[ipos].push(el.id, el.pos.x, el.pos.y, el.scale, []) - 5
        GridAPI.main._sprites[`${li}.${ipos}.${id}`] = el.sprite

        return [ipos, id]
    }

    static _removeElementInSquare(li, ipos, id) {
        const layer = GridAPI.main.layers[li]

        if (!layer) return
        if (!layer[ipos]) return
        if (layer[ipos].length <= id) return

        console.log(id, layer[ipos].length)
        layer[ipos].splice(id, 5)

        const sprites = GridAPI.main._sprites
        const pathSprite = `${li}.${ipos}.${id}`
        if (sprites[pathSprite]) {
            sprites[pathSprite].destroy()
            delete sprites[pathSprite]
        }
    }

    static getLayerIndex(zoom) {
        return parseInt(zoom / ZOOM_DIF_LAYERS)
    }

    /**
     * Deuelve todos los squares que hay entre dos puntos
     *
     * @param {Number} zoom
     * @param {Vector2} from
     * @param {Vector2} to
     */
    static getBoundsSquares(zoom, from, to) {
        const li = this.getLayerIndex(zoom)
        const [sfrom, sto] = [
            getNearestSquare(li, from),
            getNearestSquare(li, to, true)]

        const squares = []

        for (let x = sfrom.x; x < sto.x; x++)
            for (let y = sfrom.y; x < sto.y; y++)
                squares.push({
                    position: {x, y},
                    elements: this._getSquare(li, x, y)
                })

        return squares
    }

    static addElement(el, zoom, pos) {
        const li = this.getLayerIndex(zoom)
        const {x, y} = getNearestSquare(li, pos)
        const [ipos, id] = this._addElementInSquare(li, x, y, el)

        return {li, ipos, id}
    }

    static removeElement(data) {
        this._removeElementInSquare(data.li, data.ipos, data.id)
    }

    static printLayers() {
        const layers = GridAPI.main.layers

        const json = JSON.stringify(layers, (key, value) => {
            if (key !== "sprite") {
                return value
            }
        })

        const w = window.open("", "", "_blank")
        w.document.write(json)
    }

    static updateGizmos(zoom, from, to) {
        zoom -= ZOOM_START
        const main = this.main
        if (!main.settings.gizmos) return

        let li = this.getLayerIndex(zoom)

        if (li > LAYERS_COUNT)
            li = LAYERS_COUNT
        else if (li < 0)
            li = 0

        if (li !== PARAMS.last_layer) {
            PARAMS.last_layer = li
            main.debug.updateDisplay()
        }

        const ssize = getSquareSize(li)

        const [sfrom, sto] = [getNearestSquare(li, from), getNearestSquare(li, to, true)]

        const needDraw = main.lastLn !== li
            || main.lastFrom.x !== sfrom.x || main.lastFrom.y !== sfrom.y
            || main.lastTo.x !== sto.x || main.lastTo.y !== sto.y

        if (needDraw) {
            main.gizmos.clear()
            main.gizmos.lineStyle(1.3 / Math.pow(1.05, zoom), 0x00ABE7, 1)

            //main.layers[zoom]?.container?.visible = true
            main.lastLn = li
            main.lastFrom = sfrom
            main.lastTo = sto

            for (let x = sfrom.x; x < sto.x; x++)
                for (let y = sfrom.y; y < sto.y; y++)
                    main.gizmos.drawRect(x * ssize, y * ssize, ssize, ssize)
        }
    }
}
