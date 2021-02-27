import styled from 'styled-components'

const getRadius = (theme) => theme.border.radius;

export const SMBarCont = styled.div`
    position: fixed;
    width: 260px;
    height: 500px;
    border-bottom-right-radius: 25px;
    background-color: ${({ theme }) => theme.color.sec};
    padding: 15px;
    box-shadow: 11px 11px 60px -10px;
`

export const SMBarHeader = styled.div`
    height: 100px;
`

export const SMBarButtExitCont = styled.div`
    position: absolute;
    width: 31px;
    height: 55px;
    border-radius: ${({ theme }) => `0 ${getRadius(theme)} ${getRadius(theme)} 0`};
    top: 30px;
    right: -19px; 
    background-color: ${({ theme }) => theme.color.pri};

    &::before{ 
        z-index: -1;
        content: "";
        position: absolute;
        width: 0; 
        height: 0;
        transform: translateY(-50%); 
        top: 100%;

        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        
        border-right: 12px solid ${({ theme }) => theme.color.sec_dark};
    }
`

export const SMBarDDownCont = styled.div`
    width: 100%;
    height: 50px;
`