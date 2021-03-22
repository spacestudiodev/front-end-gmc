import { Children, cloneElement } from "react"
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function DynamicSwitch({ children }) {

    const [firstLoad, setFirstLoad] = useState([])
    const [last, setLast] = useState()

    const { pathname } = useLocation()
    if (pathname !== "/" && pathname !== last) setLast(pathname)

    return (
        <>
            {Children.map(children, (c, index) => {
                const enabled = pathname === c.props.target

                if (enabled && !firstLoad[index]) {
                    firstLoad[index] = true
                    setFirstLoad(firstLoad)
                }

                if (!firstLoad[index]) return null

                return cloneElement(c, { pathname: last, key: index })
            })}
        </>
    )
}