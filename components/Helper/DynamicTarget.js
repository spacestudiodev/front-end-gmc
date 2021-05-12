import { Children, cloneElement } from "react"

export default function DynamicTarget({ pathname, lastPathname, target, children }) {
    const isOpen = pathname === target
    const childs = Children.map(children, child => cloneElement(child, {
        ...child.props,
        isOpen
    }))
    return (
        <div className="dynamicTarget"
            style={{
                display: `${lastPathname === target ? "block" : "none"}`
            }}>
            {childs}
        </div>
    )
}