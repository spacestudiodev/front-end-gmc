import * as PIXI from 'pixi.js'
import Vector2 from "../modules/liria/vector2"
import {datUI} from './mainScene'
import DrawSystem from './drawSystem'
import PaintSprites from './paintSprites'

// Tamaño de la primera capa
const MAX_GRID_SIZE = 300
// Diferencia del zoom entre capas
const NEW_ZOOM_DIF_LAYERS = [0, 1.6, 3.75]
// Inicion del Zoom
const ZOOM_START = -1.5 * 6
// Area de la Grid
const AREA_GRID = new Vector2(7758, 12473)
// Parametros
const PARAMS = {
    last_layer: -1,
    gizmos: true,
    sx: 0,
    sy: 0
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

function diffInGrid(from1, to1, from2, to2, callback) {
    // Punto de partida el la x del primer recuadro
    let x = from1.x
    // Que se repita hasta llegar al final en x de ese recuadro
    while (x < to1.x) {
        // Verificamos si la x esta dentro de la x del segundo recuadro
        const inX = x >= from2.x && x < to2.x

        // Me verificara si habra algun cuadro en la columna de x
        let existY = false
        let y = from1.y
        while (y < to1.y) {
            const inY = y >= from2.y && y < to2.y

            // Verificamos si (x, y) estan dentro del segundo recuadro
            if (inX & inY) {
                // Situamos la (y) en el ultimo cuadro (y) del segundo recuadro
                // Esto con la intencion de siguir pintando si el primer recuadro es mas
                // grande que el segundo recuadro.
                y = to2.y
                continue;
            }

            if (callback)
                callback(x, y)

            y++
            existY = true
        }

        // Verificamos si x esta dentro del segundo recuadro
        // y si en la columna no habia ningun cuadro en uso 
        if (!existY && inX) {
            // Situamos la (x) en el ultimo cuadro (x) del segundo recuadro
            // Esto con la intencion de siguir pintando si el primer recuadro es mas
            // grande que el segundo recuadro.
            x = to2.x
            continue;
        }

        x++
    }
}

// -------
// Main Class
// -------

export default class GridAPI {
    /** @type {GridAPI}*/
    static main

    constructor(container, settings = {}) {
        GridAPI.main = this

        this.loading = true

        fetch("/map/json/housepositions.json")
            .then(response => response.json())
            .then(json => {
                this.layers = {...json}
                this.loading = false
            })

        this.layers = {}
        this._sprites = {}

        this.settings = settings
        PARAMS.gizmos = settings.gizmos

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
        this.debug.add(PARAMS, "gizmos").name("Gizmos").onChange(val => {
            PARAMS.gizmos = val
            this.gizmos.clear()
        })
        this.debug.add(PARAMS, "sx").name("Size X")
        this.debug.add(PARAMS, "sy").name("Size Y")
    }

    static init(container, settings = {}) {
        return new GridAPI(container, settings)
    }

    static _getSquare(li, x, y) {
        const [xlength] = getLengthGrid(getSquareSize(li))
        let result = []
        try {
            result = GridAPI.main.layers[li][x + y * xlength]
            if (!result) result = []
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

        layer[ipos].splice(id, 5)
    }

    static getLayerIndex(zoom) {
        if (PaintSprites.canScale) return PARAMS.last_layer
        zoom -= ZOOM_START
        zoom /= 6
        const maxLayers = NEW_ZOOM_DIF_LAYERS.length - 1

        let li = 0

        let i = maxLayers + 1

        while (i--) {
            if (NEW_ZOOM_DIF_LAYERS[i] < zoom) {
                li = i
                break;
            }
        }

        return li
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
            for (let y = sfrom.y; y < sto.y; y++)
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

        return {li, ipos, id, x, y, elid: el.id}
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

    static update(zoom, from, to) {
        const main = this.main

        let li = this.getLayerIndex(zoom)
        zoom -= ZOOM_START

        const ssize = getSquareSize(li)

        if (li !== PARAMS.last_layer) {
            PARAMS.last_layer = li
            const [xlength, ylength] = getLengthGrid(ssize)
            PARAMS.sx = xlength
            PARAMS.sy = ylength
            main.debug.updateDisplay()
        }

        const [sfrom, sto] = [getNearestSquare(li, from), getNearestSquare(li, to, true)]

        const changed = main.lastLn !== li
            || main.lastFrom.x !== sfrom.x || main.lastFrom.y !== sfrom.y
            || main.lastTo.x !== sto.x || main.lastTo.y !== sto.y

        if (changed) {
            if (PARAMS.gizmos) {
                main.gizmos.clear()
                main.gizmos.lineStyle(1.3 / Math.pow(1.05, zoom), 0x00ABE7, 1)
            }

            if (main.lastLn !== li) {
                for (let x = main.lastFrom.x; x < main.lastTo.x; x++)
                    for (let y = main.lastFrom.y; y < main.lastTo.y; y++) {
                        DrawSystem.main.delete(main.lastLn, x, y)
                    }

                for (let x = sfrom.x; x < sto.x; x++)
                    for (let y = sfrom.y; y < sto.y; y++) {
                        if (PARAMS.gizmos)
                            main.gizmos.drawRect(x * ssize, y * ssize, ssize, ssize)

                        DrawSystem.main.add(li, x, y)
                    }
            }
            else {
                if (PARAMS.gizmos)
                    main.gizmos.lineStyle(2.3 / Math.pow(1.05, zoom), 0x00ABE7, 1)

                const diffFrom = new Vector2(sfrom.x - main.lastFrom.x, sfrom.y - main.lastFrom.y)
                const diffTo = new Vector2(sto.x - main.lastTo.x, sto.y - main.lastTo.y)

                // Pintar el recuadro sin cambios [Only Debug]
                for (let x = sfrom.x - diffFrom.x; x < sto.x - diffTo.x; x++)
                    for (let y = sfrom.y - diffFrom.y; y < sto.y - diffTo.y; y++) {
                        if (PARAMS.gizmos)
                            main.gizmos.drawRect(x * ssize, y * ssize, ssize, ssize)
                    }

                if (PARAMS.gizmos)
                    main.gizmos.lineStyle(2.3 / Math.pow(1.05, zoom), 0x8F32A6, 1)

                // Pintar recuadro eliminado
                diffInGrid(main.lastFrom, main.lastTo, sfrom, sto, (x, y) => {
                    if (PARAMS.gizmos)
                        main.gizmos.drawRect(x * ssize, y * ssize, ssize, ssize)

                    DrawSystem.main.delete(li, x, y)
                })

                if (PARAMS.gizmos)
                    main.gizmos.lineStyle(2.3 / Math.pow(1.05, zoom), 0x39DE20, 1)

                // Pintar nuevo recuadro
                const newsfrom = new Vector2(sfrom.x - diffFrom.x, sfrom.y - diffFrom.y)
                const newsto = new Vector2(sto.x - diffTo.x, sto.y - diffTo.y)

                diffInGrid(sfrom, sto, newsfrom, newsto, (x, y) => {
                    if (PARAMS.gizmos)
                        main.gizmos.drawRect(x * ssize, y * ssize, ssize, ssize)

                    DrawSystem.main.add(li, x, y)
                })
            }

            main.lastLn = li
            main.lastFrom = sfrom
            main.lastTo = sto

        }
    }
}
