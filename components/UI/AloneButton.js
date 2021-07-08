import {forwardRef} from "react"
import { AButtonCont } from "./AloneButton.style";

const AloneButton = forwardRef(({
    width = "40px",
    height = "40px",
    background = "white",
    className = "",
    left,
    right,
    top,
    bottom,
    children,
    ...props
}, ref) => {
    return (
        <AButtonCont
            className={className}
            width={width}
            height={height}
            background={background}
            left={left}
            right={right}
            bottom={bottom}
            top={top}
            ref={ref}
            {...props}>

            {children}
        </AButtonCont>
    )
})

export default AloneButton
