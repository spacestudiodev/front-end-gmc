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


const dropdownValues = [
    "Hello World 1", "Hello World 2", "Hello World 3", "Hello World 4", "Hello World 5", "Hello World 6"
]

export default function SideMapBar({ onChangePathHover }) {
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
                        data={dropdownValues}
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