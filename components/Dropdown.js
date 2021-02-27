import { useState } from 'react'
import {
    DDownCont,
    DDownPlaceholder,
    DDownHeaderCont,
    DDownListCont,
    DDownTopShadow,
    DDownList,
    DDownListItemCont,
    DDownListItem,
    DDownValue,
    DDownArrow,
    DDownArrowCont
} from './Dropdown.style'

export default function Dropdown({
    data = [],
    value = undefined,
    placeholder = "Select",
    style,
    className }) {

    const [val, setVal] = useState(value)

    const [isOpen, setIsOpen] = useState(false)

    const [heightMain, setHeightMain] = useState("0px")
    const itemWidth = 45
    const extraMargin = 5

    const maxItems = data.length > 4 ? 4 : data.length
    const sizeList = maxItems * itemWidth
    const scrollSize = extraMargin * 2 + sizeList
    const maxHeight = heightMain + scrollSize

    return (
        <DDownCont id="ddownCont" ref={(ref) => {
            if (ref)
                setHeightMain(ref.offsetHeight)
        }} style={style} className={className} >
            <DDownListCont isOpen={isOpen} maxHeight={maxHeight}>
                <div id="ddownscroll" style={{ width: "100%", height: scrollSize, marginTop: heightMain, overflow: 'auto' }}>
                    <DDownList extraMargin={extraMargin}>
                        {data.map((v, index) => (
                            <DDownListItemCont isActive={index === val}
                                isLast={index === data.length - 1}
                                itemWidth={itemWidth}
                                key={index}
                                onClick={() => {
                                    setVal(index)
                                    setIsOpen(false)
                                }}>
                                <DDownListItem>{v}</DDownListItem>
                            </DDownListItemCont>
                        ))}
                    </DDownList>
                </div>

                <DDownTopShadow height={heightMain + "px"} />

            </DDownListCont>

            <DDownHeaderCont onClick={() => {
                setIsOpen(!isOpen);
            }} >
                {val !== undefined
                    ?
                    <DDownValue>{data[val]}</DDownValue>
                    :
                    <DDownPlaceholder>{placeholder}</DDownPlaceholder>}

                <DDownArrowCont w="16.98px">
                    <DDownArrow w="10px" h="2px" l="2px" />
                    <DDownArrow w="2px" h="10px" t="-4px" />
                </DDownArrowCont>

            </DDownHeaderCont>
        </DDownCont>
    )
}