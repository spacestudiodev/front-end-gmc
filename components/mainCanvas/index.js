import { useRef, useEffect } from 'react'
import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'
import {
    lima_fencing_highway, 
    lima_fencing_major_roads, 
    lima_fencing_perimeter,
    lima_fencing_roads
} from '../../districtsMaps/lima_fencing'

import Input from '../../modules/liria/Input'
import Camera from '../../modules/liria/camera'
import {houseMapElement} from '../../elementsInMap/house'
import PaintSprites from '../../liriaScripts/paintSprites'

export default function MainCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
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

        container.addChild(perimeter)
        container.addChild(highway)
        container.addChild(majorRoads)
        container.addChild(roads)

        const camera = new Camera(container, app.view)
        const paint = new PaintSprites(container)

        app.ticker.add(() => {
            camera.update()
            paint.update()
        })
    
    }, [])

    return (
        <canvas ref={canvasRef} className="mainCanvas" />
    )
}


/*
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId
    
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const liria = new Liria(canvas, ctx)
        liria.addNode(new MainScene())
        
        const anim = () => {
            liria.render()
        }

        const render = () => {
            liria.render()
            animationFrameId = window.requestAnimationFrame(render)            
        }

        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
            liria.dispose()
        }
*/
