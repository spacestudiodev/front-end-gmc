import {matchPath} from 'react-router-dom'
import {Children, cloneElement, useEffect, useRef, useState} from "react"
import {setActiveHeight} from '../templates/BoxInformation'

export default function DynamicTarget({persistent, match, pathname, lastPathname, path, children, ...props}) {
    let [_match, setMatch] = useState(match)
    const isActive = _match?.url === pathname

    useEffect(() => {
        if (match) {
            setMatch(_match = match)
        }
        else {
            const newMatch = matchPath(lastPathname, {
                path,
                exact: props.exact,
                strict: props.strict,
            })
            setMatch(_match = newMatch)
        }
    }, [pathname])

    const childs = Children.map(children, child => {
        if (typeof child.type === "string") return child

        return cloneElement(child, {
            ...child.props,
            isOpen: isActive,
            match: _match,
            params: _match?.params,
            path,
        })
    })

    return (
        <div style={{
            display: `${_match !== null || persistent ? "block" : "none"}`,
            position: "absolute",
            width: "100%",
            pointerEvents: isActive ? "initial" : "none",
        }}>
            {childs}
        </div>
    )
}
