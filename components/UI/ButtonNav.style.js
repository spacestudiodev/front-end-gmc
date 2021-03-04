import styled from 'styled-components'

import { ButtonDivCont } from './ButtonDiv.style'
import { Text } from './Text.style'


export const BNavIconCont = styled.div`
    position: relative;
    width: 33px;
    height: 33px;
    background-color: ${({ theme }) => theme.color.light};
    border-radius: 5px;

    & > img {
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
    }
`

export const BNavTitle = styled(Text)`
    font-size: 13px;
`

export const BNavDescription = styled(Text)`
    font-size: 12px;
    color: ${({ theme }) => theme.color.fnt_light};
`

export const BNavCont = styled(ButtonDivCont)`
    display: flex;
    justify-content: center;
    cursor: pointer;

    background-color: ${({ theme }) => theme.color.sec};
    border-radius: ${({ theme }) => theme.border.radius};
    transition: box-shadow 150ms, background-color 100ms;

    padding: 15px 10px;

    &:hover {
        background-color: ${({ theme }) => theme.color.pri};
    }

    & > #bnavicon {
        margin-right: 15px;
    }
`