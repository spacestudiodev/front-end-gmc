import {useRef, useEffect, useContext} from 'react'
import {motion} from 'framer-motion'
import {urlServerImages, urlServerPDF} from '../../api/server'
import AloneButton from '../UI/AloneButton'
import {ActiveShareBox} from '../UI/sharedListBox'
import {DownloadIcon} from '../UI/svg/DownloadIcon'
import {SharedIcon} from '../UI/svg/SharedIcon'
import {PDFIButonsCont, PDFICont, PDFIInfoCont, PDFIItem, PDFIItemsCont} from './PDFItems.style'
import {DynamicHeight} from './BoxInformation'

const container = {
    open: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.06
        }
    },
}

const animItem = {
    close: {y: 20, opacity: 0},
    open: {
        y: 0,
        opacity: 1,
    },
    hover: {
        scale: 1.025,
    }
}

const animImg = {
    hover: {
        scale: 1.1,
    }
}

export default function PDFItems({data, template, isOpen, imagesUrl, downloadUrl}) {
    const _imagesUrl = `${urlServerImages}/${imagesUrl}/`
    const _downloadPDF = `${urlServerPDF}/${downloadUrl}/`

    const {itemAccess} = template
    const animOpen = isOpen && data ? "open" : "close"

    const ref = useRef(new Array())
    const contentRef = useRef()

    const changeHeight = useContext(DynamicHeight)

    const sendHeight = () => {
        if (data && isOpen && contentRef.current) {
            changeHeight(contentRef.current.clientHeight)
        }
    }

    useEffect(() => {
        sendHeight()
    }, [data, isOpen, contentRef])

    useEffect(() => {
        sendHeight()
    }, [])

    return (
        <PDFICont ref={contentRef} variants={container} initial="close" animate={animOpen}>
            {data?.map((item, index) => {
                return (
                    <PDFIItemsCont key={index} variants={animItem} whileHover={{scale: 1.04}}>
                        <PDFIItem as={motion.div} whileHover="hover">
                            <motion.img variants={animImg} src={_imagesUrl + item[itemAccess.image]} />
                            <PDFIInfoCont>
                                <div dangerouslySetInnerHTML={{__html: item[itemAccess.title]}}></div>
                                <PDFIButonsCont>
                                    <AloneButton onClick={() => {
                                        window.open(_downloadPDF + item[itemAccess.download])
                                    }} className="btborder brd-yellow" background="transparent">
                                        <DownloadIcon fill="#F8EB22" />
                                    </AloneButton>
                                    <AloneButton ref={r => ref.current[index] = r} onClick={() => {
                                        ActiveShareBox("", ref.current[index])
                                    }} className="btborder shareButton" background="transparent">
                                        <SharedIcon />
                                    </AloneButton>
                                </PDFIButonsCont>
                            </PDFIInfoCont>
                        </PDFIItem>
                    </PDFIItemsCont>
                )
            })}
        </PDFICont>
    )
}
