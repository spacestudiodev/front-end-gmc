import styled from 'styled-components'
import { ButtonDivCont } from './ButtonDiv.style'

export const AButtonCont = styled(ButtonDivCont)`
    width: ${props => props.width};
    height: ${props => props.height};
    background: ${props => props.background};
    position: ${props => props.left || props.right || props.top || props.bottom ? "absolute" : "relative"};
    left: ${props => props.left};
    right: ${props => props.right};
    top: ${props => props.top};
    bottom: ${props => props.bottom};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
`