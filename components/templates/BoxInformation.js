import {useEffect, useState, useRef, createContext} from 'react'

import {
    BInfoCont,
    BInfoHeader,
    BInfoContentCont,
    BInfoHeaderText,
    BInfoTopBorder,
    BInfoMenuButton,
    BInfoMarginCont
} from "./BoxInformation.style"
import {useLocation, useHistory} from 'react-router-dom'
import Button from '../UI/ButtonDiv'
import {SharedListBox} from "../UI/sharedListBox"

function isUpperCase(aCharacter) {
    return (aCharacter >= 'A') && (aCharacter <= 'Z');
}

export const DynamicHeight = createContext()

export function BoxInformation({pathHover, title, children}) {
    const [activeHeight, setActiveHeight] = useState(0)

    const {pathname} = useLocation()
    const history = useHistory()

    const [lastText, setLastText] = useState("")

    const mainRef = useRef();

    const isActive = pathname !== "/"

    const [canHover, setCanHover] = useState(!isActive)

    const isHover = pathHover !== undefined &&
        pathHover !== "/" &&
        pathHover !== "" &&
        !isActive && canHover

    // Obtener el titulo de la ventana
    if (title === undefined || isActive) {
        const titleArr = pathname.split("-")
        let result = titleArr[0].charAt(1).toUpperCase() + titleArr[0].slice(2);

        for (let i = 1; i < titleArr.length; i++) {
            const word = titleArr[i];
            result += " " + word.charAt(0).toUpperCase() + word.slice(1)
        }

        if (result !== "" && result !== lastText) setLastText(result)
    } else
        if (title !== "" && title !== lastText) setLastText(title)

    //-----------------
    // Eventos para controlar las animaciones
    //-----------------

    const startTransition = (e) => {
        if (e.srcElement === mainRef.current && e.propertyName === "transform") {
            if (window.location.pathname !== "/")
                setCanHover(false)
        }
    }

    const endTransition = (e) => {
        if (e.srcElement === mainRef.current && e.propertyName === "transform") {
            if (window.location.pathname === "/")
                setCanHover(true)
        }
    }

    useEffect(() => {

        mainRef.current.addEventListener("transitionstart", startTransition)
        mainRef.current.addEventListener("transitionend", endTransition)

        return () => {
            mainRef.current.removeEventListener("transitionstart", startTransition)
            mainRef.current.removeEventListener("transitionend", endTransition)
        }
    }, [mainRef])

    const valueContext = height => {
        setActiveHeight(height)
    }

    //------------
    //------------
    return (
        <DynamicHeight.Provider value={valueContext}>
            <BInfoCont ref={mainRef} isActive={isActive} isHover={isHover}>
                <BInfoHeader>
                    <BInfoTopBorder />

                    <BInfoMarginCont>
                        <BInfoHeaderText bold>{lastText}<span>(Presionar para desplegar)</span></BInfoHeaderText>

                        <Button className="backButton" src="/images/arrowL.png" onClick={() => history.goBack()}>
                            Atras
                        </Button>

                    </BInfoMarginCont>

                </BInfoHeader>
                <BInfoContentCont>
                    <div className="dynamicTarget" style={{height: activeHeight + "px"}}>
                        {children}
                    </div >
                </BInfoContentCont>
                <SharedListBox />
            </BInfoCont>
        </DynamicHeight.Provider>
    )
}
