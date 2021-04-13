import { useRef, useEffect, useState } from 'react'
import Liria from '../../modules/liria'
import EngineBehaviour from './engine/engineBehaviour'

export default function MainCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId
    
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        //const engine = new EngineBehaviour(ctx)
        const liria = new Liria(ctx)

        const render = () => {
            //engine.render()

            liria.render()
            animationFrameId = window.requestAnimationFrame(render)            
        }

        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
            //engine.dispose()

            liria.dispose()
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="mainCanvas" />
    )
}
