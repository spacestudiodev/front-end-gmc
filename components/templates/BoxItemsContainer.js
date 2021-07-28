import {useRef, useEffect, useContext} from 'react'
import {motion} from "framer-motion"
import {urlServerImages} from "../../api/server"
import AloneButton from "../UI/AloneButton"
import Button from "../UI/ButtonDiv"
import {SharedIcon} from "../UI/svg/SharedIcon"
import {BoxICCont} from "./BoxItemsContainer.style"
import {ActiveShareBox} from '../UI/sharedListBox'
import {useHistory, useLocation} from 'react-router-dom'
import {DynamicHeight} from './BoxInformation'

const container = {
    open: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.11,
        }
    },
}

const mitem = {
    close: {y: 20, opacity: 0},
    open: {
        y: 0,
        opacity: 1
    }
}


// Test comment
function BoxItemsContainer({
    data,
    template,
    className,
    isOpen,
    resourceUrl,
    duration = 0.25,
    variantsContainer,
    itemVariants
}) {
    const resourcesUrl = `${urlServerImages}/${resourceUrl}`

    const {displayType, itemAccess} = template
    const ref = useRef(new Array())
    const contentRef = useRef()
    const history = useHistory()
    const location = useLocation()
    const changeHeight = useContext(DynamicHeight)

    const sendHeight = () => {
        if (data && isOpen && contentRef.current) {
            changeHeight(contentRef.current?.clientHeight)
        }
    }

    const gia = (item, key) => {
        const access = itemAccess[key]
        return typeof access === "function" ? access(item) : item[access]
    }

    useEffect(() => {
        sendHeight()
    }, [data, isOpen, contentRef])

    useEffect(() => {
        sendHeight()
    }, [])

    return (
        <BoxICCont
            ref={contentRef}
            initial="close"
            animate={isOpen && data ? "open" : "close"}
            as={motion.div}
            variants={{...container, ...variantsContainer}}
            dtype={displayType}
            className={className}>
            {data?.map((item, index) => {
                const description = item[itemAccess.description]

                return (
                    <motion.div
                        variants={{...mitem, ...itemVariants}}
                        className="boxItem"
                        whileHover={{scale: 1.025, boxShadow: "0px 6px 20px -10px"}}
                        transition={{duration}}
                        key={index}>
                        <div id="imageCont">
                            <div id="image">
                                {itemAccess.image &&
                                    <img src={`${resourcesUrl}/${item.slug}/${gia(item, "image")}`} />
                                }
                            </div>
                        </div>
                        <div id="content">
                            {itemAccess.title &&
                                <h4 id="title" dangerouslySetInnerHTML={{__html: gia(item, "title")}}></h4>
                            }

                            {description &&
                                <div id="description"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            description?.length > 255 ? description?.slice(0, 250) + "..." : description
                                    }}>
                                </div>
                            }

                            {itemAccess.to &&
                                <Button className="backButton nextButton" src="/images/arrowR.png" onClick={() => {
                                    history.push(location.pathname + "/" + gia(item, "to"))
                                }}>
                                    Continuar
                                </Button>
                            }

                            {itemAccess.toHash &&
                                <Button className="backButton nextButton" src="/images/arrowR.png" onClick={() => {
                                    const hashAction = gia(item, "toHash")
                                    if(typeof hashAction === "function") {
                                        hashAction(item)
                                    } else {
                                        history.push(`#${hashAction}`)
                                    }
                                }}>
                                    Continuar
                                </Button>
                            }

                            {itemAccess.canShare &&
                                <AloneButton className="shareButton" onClick={() => {
                                    ActiveShareBox("", ref.current[index])
                                }} ref={r => ref.current[index] = r} right="5px" top="5px" background="#2D1B32" width="45px" height="45px">
                                    <SharedIcon />
                                </AloneButton>
                            }

                        </div>
                    </motion.div>
                )
            })}
        </BoxICCont>
    )
}

export default BoxItemsContainer
