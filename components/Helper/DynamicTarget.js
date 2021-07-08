import {Children, cloneElement, useEffect, useState} from "react"

function getPartsURL(url) {
    return url.split("/").map(v => {
        const isParam = v[0] === ":"
        if(isParam) v.splice(0, 1)
        return {
            type: isParam ? "param" : "static",
            url: v
        }
    })
}

function getParams (from, to) {
    const partsFrom = getPartsURL(from)
    const partsTo = to.split("/")

    if(partsFrom.length !== partsTo.length) 
        return undefined

    const result = {
        url: to,
        params: {}
    }

    let isEqual = true

    partsFrom.forEach((val, index) => {
        if(val.type === "static")
            if(val.url !== partsTo[index]) isEqual = false
        else
            result.params[val.url] = partsTo[index]
    })

    return isEqual ? result : undefined
}

export default function DynamicTarget({pathname, lastPathname, target, children}) {
    const isOpen = pathname === target
    const [_target, setParams] = useState(undefined)

    useEffect(() => {
        setParams(getParams(target, pathname))
    }, [pathname])

    const childs = Children.map(children, child => cloneElement(child, {
        ...child.props,
        isOpen,
        params: _target.params
    }))

    return (
        <div className="dynamicTarget"
            style={{
                display: `${lastPathname === _target.url ? "block" : "none"}`
            }}>
            {childs}
        </div>
    )
}
