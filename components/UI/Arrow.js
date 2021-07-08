import { useTheme } from 'styled-components'

import {
    ArrowCont,
    ArrowItem
} from './Arrow.style'

export default function Arrow({ dir = "b", color, size = 20, angle = 45 }) {

    // Grosor y el largo de las flechas
    const thickness = 1 * size / 10, radius = 5 * size / 10;
    //Conseno para saber cuanto se van a separar
    const cosine = Math.cos(angle * Math.PI / 180)
    // Calculamos la separacion y le agregamos la compensacion por el grosor
    const offset = radius / 2 * cosine - thickness / 2 * cosine + 0.16

    const theme = useTheme()

    return (
        <ArrowCont w={cosine * radius * 2 + "px"} h={cosine * radius * 2 + "px"} id="arrowCont">
            <ArrowItem w={radius + "px"} h={thickness + "px"}
                l={dir === "t" || dir === "b" ? offset : 0}
                t={dir === "l" || dir === "r" ? offset : 0}
                dir={dir} p={0}
                color={color ?? theme.color.light}
                angle={angle} />
            <ArrowItem w={radius + "px"} h={thickness + "px"}
                l={dir === "t" || dir === "b" ? -offset : 0}
                t={dir === "l" || dir === "r" ? -offset : 0}
                dir={dir} p={1}
                color={color ?? theme.color.light}
                angle={angle} />
        </ArrowCont>
    )
}
