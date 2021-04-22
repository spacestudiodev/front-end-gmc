import dynamic from 'next/dynamic'

const MainCanvasNoSSR = dynamic(() => import('../mainCanvas'), {
    ssr: false
})

export default function MapPage() {
    return (
        <div id="mapPage">
            <MainCanvasNoSSR />
        </div>
    )
}
