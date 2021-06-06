const fs = require("fs")
const parser = require("xml2json")
const getBounds = require("svg-path-bounds")

const SIZE = {x: 54, y: 87}
const MAX_SIZE = {x: 7763.364, y: 12507.642} 
const GRID_SIZE = {x: MAX_SIZE.x / SIZE.x, y: MAX_SIZE.y / SIZE.y}

const style = "fill:none;stroke:#fbb03b;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.75px"

fs.readFile("./miniroads.svg", (err, data) => {
    const json = JSON.parse(parser.toJson(data, {reversible: true}))
    const path = json.svg.path
    const result = {}

    for (let i = 0; i < path.length; i++) {
        const d = path[i].d
        const [left, top, right, bottom] = getBounds(d)

        const posUp = [parseInt((left + 542.55) / MAX_SIZE.x * SIZE.x), parseInt((top + 1111.008) / MAX_SIZE.y * SIZE.y)]

        //const posDown = [right / MAX_SIZE.x * SIZE.x, bottom / MAX_SIZE.y * SIZE.y]
        //const size = [right - left, bottom - top]

        const gridpos = posUp[0] + posUp[1] * SIZE.x

        if(!result[gridpos]) result[gridpos] = []

        result[gridpos].push(d)
    }
    
    fs.writeFile("./miniroads.json", JSON.stringify(result), () => {
        console.log("saved")
    })
})
