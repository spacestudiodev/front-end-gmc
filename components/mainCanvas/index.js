import { useRef, useEffect } from 'react'
import * as PIXI from 'pixi.js'
import MainScene from '../../liriaScripts/mainScene'

export default function MainCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const app = new PIXI.Application({
            view: canvasRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            autoDensity: true,
            backgroundColor: 0xFFD05E,
            resolution: devicePixelRatio
        })

        const mainScene = MainScene.init(app)   

        return () => {
            mainScene.dispose()
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="mainCanvas" />
    )
}
