import {useEffect, useState} from "react";
import {getListCulturalActivities} from "../../api/GETs";
import DynamicSwitch from "../Helper/DynamicSwitch";
import DynamicTarget from "../Helper/DynamicTarget";
import BoxItemsContainer from "../templates/BoxItemsContainer";
import SubCulturalActiviesPage from "./SubCulturalActivitiesPage"

export default function CulturalActivitiesPage({data, isOpen, path}) {
    return (
        <div>
            <DynamicSwitch path={path}>
                <DynamicTarget persistent exact path={path}>
                    <ListItems data={data} />
                </DynamicTarget>
                <DynamicTarget persistent exact path="/actividades-culturales/:type">
                    <SubCulturalActiviesPage/>
                </DynamicTarget>
            </DynamicSwitch>
        </div>
    )
}

const ListItems = ({isOpen, data}) => {
    const [_data, setData] = useState(data)

    useEffect(() => {
        if (!_data)
            getListCulturalActivities().then(data => setData(data))
    }, [])

    return (
        <div style={{"pointerEvents": isOpen ? "initial" : "none"}}>
            <BoxItemsContainer
                data={_data}
                isOpen={isOpen}
                variantsContainer={{
                    close: {
                        transition: {
                            delayChildren: 0,
                            staggerChildren: 0.05,
                        },
                    },
                }}
                duration={!isOpen ? 0.2 : 0.25}
                resourceUrl="actividades"
                template={{
                    displayType: "vertical",
                    itemAccess: {
                        image: "foto",
                        title: "titulo",
                        to: "slug"
                    }
                }} />
        </div>
    )
}
