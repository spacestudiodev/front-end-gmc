import styled from 'styled-components'
import { ButtonDivCont } from '../UI/ButtonDiv.style'
import { Text } from '../UI/Text.style'

const getRadius = (theme) => theme.border.radius;

const speed = "450ms"
const speedSlow = "600ms"

export const BInfoButtonBack = styled.div`
    width: 100px;

    & img {
        object-fit: contain;
    }
`

export const BInfoMarginCont = styled.div`
    width: 1080px;
    height: 250px;
    top: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`

export const BInfoMenuButton = styled(ButtonDivCont)`
    position: absolute;
    top: 30px;
    transition: transform ${speedSlow};
    transform: translateX(-31px);
    width: 31px;
    height: 55px;
    border-radius: ${({ theme }) => `0 ${getRadius(theme)} ${getRadius(theme)} 0`};
    background-color: ${({ theme }) => theme.color.light};

    & > div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const BInfoTopBorder = styled.div`
    width: 100%;
    height: 0;
    transition: height 250ms;
    background-color: ${({ theme }) => theme.color.sec};
    position: relative;

    &::after {
        content: " ";
        position: absolute;
        width: 200px;
        height: 100%;
        right: 0;
        background-color: #745535;
    }
`

export const BInfoHeaderText = styled(Text)`
    position: absolute;
    top:0;
    left: 0;
    transition: transform ${speed};
    color: ${({ theme }) => theme.color.pri};
    font-size: 25px;
    font-weight: 700;
    transform: translate(0, 20px);

    span {
        opacity: 1;
        transition: opacity 150ms;
        font-size: 13px;
        margin: 0 0 15px 15px;
        font-weight: 500;
    }
`

export const BInfoHeader = styled.div`
    width: 100%;
    transition: height ${speedSlow};
    height: 100%;
    background: ${({ theme }) => theme.color.gradiend};
`

export const BInfoContentCont = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    transition: transform ${speed};
    width: 1080px;

    .dynamicTarget {
        background-color: ${({ theme }) => theme.color.sec};
        border-radius: 24px;
        margin-bottom: 20px;
        min-height: 720px;
    }
`

export const BInfoCont = styled.div`
    position: absolute;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    top:0;
    left: 50%;
    transition: border-radius ${speed}, transform ${speed};
    transition-delay: 50ms;

    ${({ isActive, isHover }) => isActive ? `
        border-radius: 0;
        transform: translate(-50%, 0);
        transition-delay: 0ms;
    `: `
        border-radius: 35px 35px 0 0;
        transform: translate(-50%, ${isHover ? "calc(100% - 70px)" : "100%"});
    `}

    background-color: ${({ theme }) => theme.color.pri};
    
    ${({ isActive }) => isActive && `
    
        overflow: overlay;

        ${BInfoContentCont} {
            transform: translate(-50%, 130px);
        }

        ${BInfoHeaderText} {
            transform: translate(0, 45px);

            span {
                opacity: 0;
            }
        }

        ${BInfoTopBorder} {
            height: 8px;
        }

        ${BInfoHeader} {
            height: 250px;
        }

        ${BInfoMenuButton}{
            transform: translateX(0);
        }

        .backButton{
            transform: translateY(30px);
        }
    `}
`