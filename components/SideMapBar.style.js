import styled from 'styled-components'

const getRadius = (theme) => theme.border.radius;

export const SMBarCont = styled.div`
    position: fixed;
    width: 280px;
    height: 500px;
    border-bottom-right-radius: 25px;
    background-color: ${({ theme }) => theme.color.secondary};
    padding: 20px;
`

export const SMBarIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: ${({ theme }) => theme.border.radius};
    background-color: ${({ theme }) => theme.color.primary};
`

export const SMBarButtExitCont = styled.div`
    width: 35px;
    height: 60px;
    border-radius: ${({ theme }) => `0 ${getRadius(theme)} ${getRadius(theme)} 0`};
    position: absolute;
    top: 30px;
    right: -34px; 
    background-color: ${({ theme }) => theme.color.secondary};
`

export const SMBarDDownCont = styled.div`
    width: 100%;
    height: 55px;
`