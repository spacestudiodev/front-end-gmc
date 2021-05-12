import styled from 'styled-components'
import { Text } from './Text.style'

export const ButtonDivCont = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;

    & * {
        user-select: none;
    }
`

export const ButtonCont = styled(ButtonDivCont)`
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({ theme }) => theme.border.radius};
`

export const BDivIconCont = styled.div`
    margin-right: 15px;
`

export const BDivText = styled(Text)`

`