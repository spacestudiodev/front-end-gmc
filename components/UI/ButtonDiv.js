import {
    ButtonCont,
    BDivIconCont,
    BDivText
} from './ButtonDiv.style'

export default function Button({ src, className, children, onClick }) {
    return (
        <ButtonCont className={className} onClick={(e) => {
            if (onClick) onClick(e)
        }}>
            <BDivIconCont>
                <img src={src} width="25px" height="25px" />
            </BDivIconCont>
            <BDivText>
                {children}
            </BDivText>
        </ButtonCont>
    )
}