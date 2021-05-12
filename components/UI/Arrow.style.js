import styled, { useTheme } from 'styled-components'

export const ArrowItem = styled.div`
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

export const ArrowCont = styled.div`
    position: relative;
    ${({ w, h }) => `
        width: ${w};
        height: ${h};
    `}
`