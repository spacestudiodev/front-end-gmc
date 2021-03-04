import { useState } from "react"
import { BoxInformation } from "../templates/BoxInformation"
import MapPage from "./MapPage"
import SideMapBar from '../SidebarMap/SideMapBar'

export default function HomePages({ asPath }) {
    let [mainIsLoad, setMainIsLoad] = useState(false)

    const [values, setValues] = useState([asPath])

    if (asPath === "/" && !mainIsLoad) {
        mainIsLoad = true
        setMainIsLoad(true)
    }

    return (
        <div id="mainPage">
            <SideMapBar onChangePathHover={(path, title) => setValues([path, title])} />

            {mainIsLoad && <MapPage />}

            <BoxInformation pathHover={values[0]} title={values[1]}>

            </BoxInformation>
        </div>
    )
}