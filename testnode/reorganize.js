const fs = require("fs")
const getBounds = require("svg-path-bounds")
const svg = require("svgpath")

const SIZE = {x: 54, y: 87}
const MAX_SIZE = {x: 7763.364, y: 12507.642} 

fs.readFile("./miniroads.json", (err, data) => {
    if (err) return console.error("miniroads no load")
    const json = JSON.parse(data)
    const keys = Object.keys(json)

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        let path = ""

        for (let i = 0; i < json[key].length; i++) {
            const d = json[key][i]
            if(i !== 0) d[0] = "m"
            path += d
        }

        const [l, t, r, b] = getBounds(path)
        const width = r - l
        const height = b - t

        const posUp = [(l + 542.55) / MAX_SIZE.x * SIZE.x % 1 * 143.766, (t + 1111.008) / MAX_SIZE.y * SIZE.y % 1 * 143.766]

        const newPath = svg(path).translate(-l, -t).translate(posUp[0], posUp[1]).round(2).toString()
        json[key] = newPath
    }

    fs.writeFile("./miniroads_v2.json", JSON.stringify(json), () => {
        console.log("File saved!")
    })
})
