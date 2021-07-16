import {useRef} from "react"
import {SLBoxArrowCont, SLBoxCont, SLBoxItem} from "./sharedListBox.style";
import {Text} from './Text.style'

let shareBox = undefined
let containerRef = undefined
let oldRef = undefined
let eventCreated = false

export function SharedListBox({container}) {
    containerRef = container
    return (
        <div className="shareBox" style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            transform: "translateY(-10px)",
        }} ref={ref => createShareBox(ref)}>
            <SLBoxArrowCont>
                <svg width="15" height="16" viewBox="0 0 12 13" fill="none">
                    <path d="M0.189188 7.03569L4.211 1.32308C5.00767 0.191475 6.68523 0.191536 7.48182 1.3232L11.5029 7.03568L5.84604 12.6925L0.189188 7.03569Z" fill="white" />
                </svg>
            </SLBoxArrowCont>
            <SLBoxCont>
                <SLBoxItem itemWidth={40.66}>
                    <img src="images/icons/facebook-border.svg" width="20px"></img>
                    <Text secondary bold>Facebook</Text>
                </SLBoxItem>
                <SLBoxItem itemWidth={40.66}>
                    <img src="images/icons/whatsapp-border.svg" width="20px"></img>
                    <Text secondary bold>Whatsapp</Text>
                </SLBoxItem>
                <SLBoxItem itemWidth={40.66} isLast={true}>
                    <img src="images/icons/share-border.svg" width="20px"></img>
                    <Text secondary bold>Copiar</Text>
                </SLBoxItem>
            </SLBoxCont>
        </div>
    )
}

function hasClass(cName, selector) {
    var className = " " + selector + " ";
    if ((" " + cName + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1) {
        return true;
    }

    return false;
}

function createShareBox(ref) {
    if (!eventCreated){
        document.addEventListener("click", e => {
            if (e.target.closest(".shareBox")) return
            if (hasClass(e.target.className, "shareButton")) return
            DesactiveShareBox()
        })

        eventCreated = true
    }

    shareBox = ref
}

export function DesactiveShareBox() {
    const style = shareBox.style
    if (style.pointerEvents === "none") return

    style.pointerEvents = "none"
    shareBox.animate([{
        opacity: 1,
        transform: "translateY(0)"
    }, {
        opacity: 0,
        transform: "translateY(-10px)"
    }], {
        duration: 150,
        fill: "forwards",
        easing: "ease-in-out"
    })
    oldRef = undefined
}

export function ActiveShareBox(url, ref) {
    if (!shareBox) return
    if (!ref) return

    if (ref === oldRef) {
        DesactiveShareBox()
        return
    }

    const style = shareBox.style
    const parent = shareBox.parentElement
    const {x, y, height} = ref.getBoundingClientRect()

    style.top = y + parent.scrollTop + height + 10 + "px"
    style.left = x + parent.scrollLeft - 160 + 47 + "px"
    style.pointerEvents = "all"

    shareBox.animate([{
        opacity: 0,
        transform: "translateY(-10px)"
    }, {
        opacity: 1,
        transform: "translateY(0)"
    }], {
        duration: 150,
        fill: "forwards",
        easing: "ease-in-out"
    })

    oldRef = ref
}

