import { motion } from 'framer-motion'
import styled from 'styled-components'

export const PDFICont = styled(motion.div)`
    width: 100%;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`

export const PDFIItemsCont = styled(motion.div)`
    position: relative;
    width: 265px;
    height: 315px;
    background-color: #4F2D5A;
    overflow: hidden;
    padding: 15px;
    border-radius: 15px;
    margin-bottom: 30px;
`

export const PDFIItem = styled.div`
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

export const PDFIInfoCont = styled.div`
    position: absolute;
    width: 100%;
    height: 130px;
    bottom: 0;
    left: 0;
    background-color: #4F2D5A;
    box-shadow: 0 -6px 21px 0 #00000059;
    padding: 20px 18px 20px 18px;
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: white;
    text-transform: uppercase;
`

export const PDFIButonsCont = styled.div`
    position: absolute;
    bottom: 20px;
    left: auto;
    right: auto;
    display: flex;
    justify-content: space-between;
    width: 94px;
    height: 40px;
`