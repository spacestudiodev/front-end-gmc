import {useRef, useEffect} from 'react'
import * as PIXI from 'pixi.js'
import MainScene from '../../liriaScripts/mainScene'

export default function MainCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const app = new PIXI.Application({
            view: canvasRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false,
            backgroundColor: 0xA8DDF4,
            resolution: devicePixelRatio,
            autoDensity: true
        })

        const mainScene = MainScene.init(app)
        return () => { mainScene.dispose() }
    }, [])

    return (
        <canvas ref={canvasRef} className="mainCanvas" />
    )
}
