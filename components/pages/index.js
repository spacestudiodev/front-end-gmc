import { useState } from "react"
import { useLocation } from 'react-router-dom'

import { BoxInformation } from "../templates/BoxInformation"

import DynamicTarget from "../Helper/DynamicTarget"
import DynamicSwitch from "../Helper/DynamicSwitch"

import SideMapBar from '../SidebarMap/SideMapBar'

import MapPage from "./MapPage"
import NewFindingsPage from "./NewFindingsPage"

export default function HomePages() {
    let [mainIsLoad, setMainIsLoad] = useState(false)

    const { pathname } = useLocation()

    const [values, setValues] = useState([])

    if (pathname === "/" && !mainIsLoad) {
        mainIsLoad = true
        setMainIsLoad(true)
    }

    return (
        <div id="mainPage">
            <SideMapBar onChangePathHover={(path, title) => setValues([path, title])} />

            {mainIsLoad && <MapPage />}

            <BoxInformation pathHover={values[0]} title={values[1]}>

                <DynamicSwitch>
                    <DynamicTarget target="/nuevosHallazgos">
                        <NewFindingsPage></NewFindingsPage>
                    </DynamicTarget>

                    <DynamicTarget target="/actividadesCulturales">
                        actividadesCulturales
                    </DynamicTarget>
                </DynamicSwitch>

            </BoxInformation>
        </div>
    )
}