import styled from "styled-components"
import {DDownListItemCont} from "./Dropdown.style"

export const SLBoxCont = styled.div`
    width: 160px;
    border-radius: 12px;
    background-color: #FFF;
    overflow: hidden;
    padding: 5px 0;
    box-sizing: unset;
    box-shadow: 0px 3px 11px 0px #00000044;
`

export const SLBoxItem = styled(DDownListItemCont)`
    padding-right: 50px;
    padding-left: 50px;

    &::after {
        width: 90px;
    }

    & > img {
        position: absolute;
        left: 15px;
        user-select: none;
        -webkit-user-drag: none;
    }
`

export const SLBoxArrowCont = styled.div`
    position: absolute;
    top: -8.5px;
    right: 20px;
`
