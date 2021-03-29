import { motion } from 'framer-motion'
import { urlServerImages } from '../../api/server'
import AloneButton from '../UI/AloneButton'
import { DownloadIcon } from '../UI/svg/DownloadIcon'
import { SharedIcon } from '../UI/svg/SharedIcon'
import { PDFIButonsCont, PDFICont, PDFIInfoCont, PDFIItem, PDFIItemsCont } from './PDFitems.style'

const container = {
    open: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.06
        }
    },
}

const animItem = {
    close: { y: 20, opacity: 0 },
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

export default function PDFItems({ data, template, isOpen, imagesUrl, downloadUrl }) {
    const _imagesUrl = `${urlServerImages}/${imagesUrl}/`

    const { itemAccess } = template
    const animOpen = isOpen && data ? "open" : "close"

    return (
        <PDFICont variants={container} initial="close" animate={animOpen}>
            {data?.map((item, index) => {
                return (
                    <PDFIItemsCont key={index} variants={animItem} whileHover={{ scale: 1.04 }}>
                        <PDFIItem as={motion.div} whileHover="hover">
                            <motion.img variants={animImg} src={_imagesUrl + item[itemAccess.image]} />
                            <PDFIInfoCont>
                                <div dangerouslySetInnerHTML={{ __html: item[itemAccess.title] }}></div>
                                <PDFIButonsCont>
                                    <AloneButton className="btborder brd-yellow" background="transparent">
                                        <DownloadIcon fill="#F8EB22" />
                                    </AloneButton>
                                    <AloneButton className="btborder" background="transparent">
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