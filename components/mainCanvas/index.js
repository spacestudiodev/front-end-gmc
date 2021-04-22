import { useRef, useEffect, createElement } from 'react'
import MainScene from '../../liriaScripts/mainScene'
import Liria from '../../modules/liria'
import EngineBehaviour from './engine/engineBehaviour'
import * as PIXI from 'pixi.js'

export default function MainCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId
    
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const liria = new Liria(canvas, ctx)
        liria.addNode(new MainScene())

        //const texture = new PIXI.Texture.from(canvas)       

        //const container = new PIXI.Container()
        //app.stage.addChild(container)

        //const canvTexture = PIXI.Sprite.from(texture)
        //container.addChild(canvTexture)

        const anim = () => {
            liria.render()
            //texture.update()
        }

        //app.ticker.add(anim)

        const render = () => {
            liria.render()
            animationFrameId = window.requestAnimationFrame(render)            
        }

        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
            liria.dispose()
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="mainCanvas" />
    )
}
