import { useRef, useEffect } from 'react'
import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'
import {
    lima_fencing_highway, 
    lima_fencing_major_roads, 
    lima_fencing_perimeter,
    lima_fencing_roads
} from '../../districtsMaps/lima_fencing'

import Input from '../../modules/liria/input'
import Camera from '../../modules/liria/camera'
import PaintSprites from '../../liriaScripts/paintSprites'
import {brena_district} from '../../districtsMaps/brena'
import GridAPI from '../../liriaScripts/gridAPI'

export default function MainCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const brena = new SVG(brena_district)
        const perimeter = new SVG(lima_fencing_perimeter)
        const highway = new SVG(lima_fencing_highway)
        const majorRoads = new SVG(lima_fencing_major_roads)
        const roads = new SVG(lima_fencing_roads)

        const app = new PIXI.Application({
            view: canvasRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            autoDensity: true,
            backgroundColor: 0xffffff,
            resolution: devicePixelRatio
        })

        const container = new PIXI.Container()
        const input = new Input(app.view)

        app.stage.addChild(container)

        brena.position.set(355, 245)
        container.addChild(brena)

        container.addChild(perimeter)
        container.addChild(highway)
        container.addChild(majorRoads)
        container.addChild(roads)

        GridAPI.init(container, {
            gizmos: true
        })

        const camera = new Camera(container, app)
        const paint = new PaintSprites(container)

        app.ticker.add(() => {
            camera.update()
            paint.update()
        })

        return () => {
            input.destroy()
        }
    
    }, [])

    return (
        <canvas ref={canvasRef} className="mainCanvas" />
    )
}
