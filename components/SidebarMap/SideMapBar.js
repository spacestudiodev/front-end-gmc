import {
    SMBarCont,
    SMBarHeader,
    SMBarButtExitCont,
    SMBarDDownCont
} from './SideMapBar.style'

import Dropdown from '../UI/Dropdown'
import Arrow from '../UI/Arrow'
import ButtonNav from '../UI/ButtonNav'
import Button from '../UI/ButtonDiv'
import Separator from '../UI/Separator'
import {useEffect, useState} from 'react'
import {getDistricts} from '../../api/GETs'

export default function SideMapBar({onChangePathHover, districts}) {

    const [_districts, setDistricts] = useState(districts)

    useEffect(() => {
        if (!_districts)
            getDistricts().then(data => setDistricts(data.map(val => val.nombre)))
    }, [])

    return (
        <SMBarCont>
            <SMBarHeader>
                <img src="/images/logogmc.png"
                    alt="Logo GMC"
                    width="130px"
                    height="50px"
                    id="logogmc" />
            </SMBarHeader>

            <SMBarButtExitCont>
                <Arrow dir="l" size={23} />
            </SMBarButtExitCont>

            <div id="content">
                <SMBarDDownCont>
                    <Dropdown
                        data={_districts}
                        value={undefined}
                        placeholder="Select a District" />
                </SMBarDDownCont>

                <div id="smbarNav">
                    <ButtonNav
                        link="/nuevos-hallazgos"
                        icon="/images/newFindings.png"
                        title="Nuevos Hallazgos"
                        description="Hallazgos que pronto estarán en el mapa"
                        onHover={onChangePathHover} />
                    <ButtonNav
                        link="/actividades-culturales"
                        icon="/images/activities.png"
                        title="Actividades Culturales"
                        description="Talleres, presentaciones..."
                        onHover={onChangePathHover} />
                    <ButtonNav
                        link="/publicaciones"
                        icon="/images/publications.png"
                        title="Publicaciones"
                        description="PDFs para leer y descargar"
                        onHover={onChangePathHover} />
                </div>
                <Separator space="20px"></Separator>
                <Button className="playVideo" src="/images/playicon.png">
                    Reproducir video
                </Button>
            </div>
        </SMBarCont >
    )
}
