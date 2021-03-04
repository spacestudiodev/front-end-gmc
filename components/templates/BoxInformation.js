import { useEffect, useState, useRef } from 'react'

import {
    BInfoCont,
    BInfoHeader,
    BInfoContentCont,
    BInfoHeaderText,
    BInfoTopBorder,
    BInfoMenuButton,
    BInfoMarginCont
} from "./BoxInformation.style";
import { useLocation } from 'react-router-dom'

function isUpperCase(aCharacter) {
    return (aCharacter >= 'A') && (aCharacter <= 'Z');
}

export function BoxInformation({ pathHover, title }) {

    const { pathname } = useLocation()
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
        const input = pathname.charAt(1).toUpperCase() + pathname.slice(2);

        let result = input

        for (let i = 1; i < input.length; i++) {
            let char = input.charAt(i)
            if (isUpperCase(char)) {
                result = [input.slice(0, i), " ", input.slice(i)].join("")
            }
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

    //------------
    //------------

    return (
        <BInfoCont ref={mainRef} isActive={isActive} isHover={isHover}>
            <BInfoHeader>
                <BInfoTopBorder />

                <BInfoMenuButton>
                    <div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 18L4 18" stroke="#2D1B33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 12L4 12" stroke="#2D1B33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 6L4 6" stroke="#2D1B33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </BInfoMenuButton>

                <BInfoMarginCont>
                    <BInfoHeaderText bold>{lastText}<span>(Presionar para desplegar)</span></BInfoHeaderText>
                </BInfoMarginCont>

            </BInfoHeader>
            <BInfoContentCont>

            </BInfoContentCont>
        </BInfoCont>
    )
}