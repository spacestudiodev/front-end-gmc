import {useState} from 'react'
import {useTheme} from 'styled-components'

import Arrow from './Arrow'
import {
    DDownCont,
    DDownHeaderCont,
    DDownListCont,
    DDownTopShadow,
    DDownList,
    DDownListItemCont,
} from './Dropdown.style'
import {TextPlaceholder, Text} from './Text.style'

export default function Dropdown({
    data = [],
    value = undefined,
    placeholder = "Select",
    style,
    className, ...props}) {

    const [val, setVal] = useState(value)

    const [isOpen, setIsOpen] = useState(false)

    const [heightMain, setHeightMain] = useState("0px")
    const itemWidth = 45
    const extraMargin = 5

    const maxItems = data.length > 4 ? 4 : data.length
    const sizeList = maxItems * itemWidth
    const scrollSize = extraMargin * 2 + sizeList
    const maxHeight = heightMain + scrollSize

    const theme = useTheme()

    return (
        <DDownCont id="ddownCont" ref={(ref) => {
            if (ref)
                setHeightMain(ref.offsetHeight)
        }} style={style} className={className} >
            <DDownListCont isOpen={isOpen} maxHeight={maxHeight}>
                <div id="ddownscroll" style={{width: "100%", height: scrollSize, marginTop: heightMain, overflow: 'auto'}}>
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
                                <Text secondary bold>{v}</Text>
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
                    <Text secondary bold>{data[val]}</Text>
                    :
                    <TextPlaceholder bold>{placeholder}</TextPlaceholder>}

                <Arrow dir={isOpen ? "t" : "b"} color={theme.color.fnt_sec} />

            </DDownHeaderCont>
        </DDownCont>
    )
}
