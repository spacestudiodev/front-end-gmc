import { useState } from "react"
import { useLocation } from 'react-router-dom'

import { BoxInformation } from "../templates/BoxInformation"

import DynamicTarget from "../Helper/DynamicTarget"
import DynamicSwitch from "../Helper/DynamicSwitch"

import SideMapBar from '../SidebarMap/SideMapBar'

import MapPage from "./MapPage"
import NewFindingsPage from "./NewFindingsPage"
import CulturalActivitiesPage from "./CulturalActivitiesPage"
import PublicationsPage from "./PublicationsPage"

export default function HomePages(props) {
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
                    <DynamicTarget target="/nuevos-hallazgos">
                        <NewFindingsPage data={props.newFindings} />
                    </DynamicTarget>

                    <DynamicTarget target="/actividades-culturales">
                        <CulturalActivitiesPage data={props.culturalActivities} />
                    </DynamicTarget>

                    <DynamicTarget target="/publicaciones">
                        <PublicationsPage data={props.publications} />
                    </DynamicTarget>
                </DynamicSwitch>

            </BoxInformation>
        </div>
    )
}