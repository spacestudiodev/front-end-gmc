import styled, { useTheme } from 'styled-components'

const ArrowItem = styled.div`
    position: absolute;

    ${({ w, h, l, t }) => `
        width: ${w};
        height: ${h};
        left: calc(50% + ${l ?? 0}px);
        top: calc(50% + ${t ?? 0}px);
    `}

    border-radius: 15px;
    background-color: ${({ color }) => color};
    transition: transform 250ms;
    transform: translate(-50%, -50%) rotate(${({ dir, p, angle }) =>
        dir === "t" ? p === 1 ? `-${angle}deg` : `${angle}deg` :
            dir === "b" ? p === 1 ? `${angle}deg` : `${180 - angle}deg` :

                dir === "l" ? p === 1 ? `${angle - 90}deg` : `${-angle - 90}deg` :
                    p === 1 ? `${-(angle - 90)}deg` : `${-(180 - angle - 90)}deg`});
`

const ArrowCont = styled.div`
    position: relative;
    ${({ w, h }) => `
        width: ${w};
        height: ${h};
    `}
`

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