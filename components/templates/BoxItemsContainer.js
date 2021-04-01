import { motion } from "framer-motion"
import { urlServerImages } from "../../api/server"
import AloneButton from "../UI/AloneButton"
import Button from "../UI/ButtonDiv"
import { SharedIcon } from "../UI/svg/SharedIcon"
import { BoxICCont } from "./BoxItemsContainer.style"

const container = {
    open: {
        transition: {
            delayChildren: 0.15,
            staggerChildren: 0.11
        }
    }
}

const mitem = {
    close: { y: 20, opacity: 0 },
    open: {
        y: 0,
        opacity: 1
    }
}

// Test comment
function BoxItemsContainer({ data, template, className, isOpen, resourceUrl }) {
    const resourcesUrl = `${urlServerImages}/${resourceUrl}`

    const { displayType, itemAccess } = template
    return (
        <BoxICCont
            initial="close"
            animate={isOpen && data ? "open" : "close"}
            as={motion.div}
            variants={container}
            dtype={displayType}
            className={className}>
            {data?.map((item, index) => {
                const description = item[itemAccess.description]

                return (
                    <motion.div
                        variants={mitem}
                        className="boxItem"
                        whileHover={{ scale: 1.025, boxShadow: "0px 6px 20px -10px" }}
                        key={index}>
                        <div id="imageCont">
                            <div id="image">
                                {itemAccess.image &&
                                    <img src={`${resourcesUrl}/${item.slug}/${item[itemAccess.image]}`} />
                                }
                            </div>
                        </div>
                        <div id="content">
                            {itemAccess.title &&
                                <h4 id="title" dangerouslySetInnerHTML={{ __html: item[itemAccess.title] }}></h4>
                            }

                            {description &&
                                <div id="description"
                                    dangerouslySetInnerHTML={{ __html: description?.length > 255 ? description?.slice(0, 250) + "..." : description }}></div>
                            }

                            {itemAccess.to &&
                                <Button className="backButton nextButton" src="/images/arrowR.png" onClick={() => { }}>
                                    Continuar
                                </Button>
                            }

                            {itemAccess.canShare &&
                                <AloneButton right="5px" top="5px" background="#2D1B32" width="45px" height="45px">
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
