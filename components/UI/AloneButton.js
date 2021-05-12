import { AButtonCont } from "./AloneButton.style";

export default function AloneButton({
    width = "40px",
    height = "40px",
    background = "white",
    className = "",
    left,
    right,
    top,
    bottom,
    children
}) {
    return (
        <AButtonCont
            className={className}
            width={width}
            height={height}
            background={background}
            left={left}
            right={right}
            bottom={bottom}
            top={top}>
            {children}
        </AButtonCont>
    )
}