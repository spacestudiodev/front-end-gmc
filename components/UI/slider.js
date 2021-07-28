import {Carousel} from "react-responsive-carousel"

export default function Slider({images}) {
    return (
        <Carousel autoPlay showArrows={true} dynamicHeight infiniteLoop showStatus={false} width="100%" showThumbs={false}>
            {images.map((image, index) => {
                return (
                    <div key={index}>
                        <img src={image} />
                    </div>
                )
            })}
        </Carousel>
    )
}
