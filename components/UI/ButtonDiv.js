import {
    ButtonCont,
    BDivIconCont,
    BDivText
} from './ButtonDiv.style'

export default function Button({ src, className, children }) {
    return (
        <ButtonCont className={className}>
            <BDivIconCont>
                <img src={src} width="25px" height="25px" />
            </BDivIconCont>
            <BDivText>
                {children}
            </BDivText>
        </ButtonCont>
    )
}