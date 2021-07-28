import {useEffect, useState} from 'react'
import ReactModal from "react-modal";
import {SimplemodalContainer, SmDescription, SmExitButton, SmTitle} from "./simplemodal.style";
import Slider from "./slider";
import {urlServerImages} from '../../api/server';

export default function Simplemodal({isOpen, data, onExit, urlImages}) {
    const [images, setImages] = useState([])

    useEffect(() => {
        setImages(data.foto.split('|').map((v) => `${urlServerImages}/${urlImages}/${v}`))
    }, [data])

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={() => onExit()}
            loop
            className="Modal"
            overlayClassName="Overlay">
            <SimplemodalContainer>
                <SmExitButton onClick={() => onExit()}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 1L1 11M1 1L11 11L1 1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </SmExitButton>
                <SmTitle>
                    {data?.titulo_popup.toUpperCase()}
                </SmTitle>
                <SmDescription dangerouslySetInnerHTML={{__html: data?.descripcion}} />
                <Slider images={images} />
            </SimplemodalContainer>
        </ReactModal>
    )
}
