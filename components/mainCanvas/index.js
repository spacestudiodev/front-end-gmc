import { useRef, useEffect } from 'react'
import EngineBehaviour from './engine/engineBehaviour'

export default function MainCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current

        const ctx = canvas.getContext('2d')
        let animationFrameId
    
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const engine = new EngineBehaviour(ctx)

        const render = () => {
            engine.render()
            animationFrameId = window.requestAnimationFrame(render)
        }

        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
            engine.dispose()
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="mainCanvas" />
    )
}
