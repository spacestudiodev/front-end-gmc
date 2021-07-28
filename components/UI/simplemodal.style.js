import styled from "styled-components";

export const SimplemodalContainer = styled.div`
    width: 100%;
    padding: 30px 40px;
`

export const SmExitButton = styled.div`
    position: absolute;
    top: 30px;
    right: 20px;
    width: 30px;
    height: 30px;
    background-color: #DC5771;
    border-radius: 8px;
    
    svg {
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
`

export const SmTitle = styled.h3`
    color: white;
    font-size: 18px;
    font-weight: bold;
    width: calc(100% - 60px);
`

export const SmDescription = styled.p`
    margin-top: 20px;
    color: white;
    font-size: 11px;
    width: calc(100% - 60px);
    line-height: 17px;
`
