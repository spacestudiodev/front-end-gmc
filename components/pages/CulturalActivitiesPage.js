import { useEffect, useState } from "react";
import { getListCulturalActivities } from "../../api/GETs";
import BoxItemsContainer from "../templates/BoxItemsContainer";

export default function CulturalActivitiesPage({ data, isOpen }) {
    const [_data, setData] = useState(data)

    useEffect(() => {
        if (!_data)
            getListCulturalActivities().then(data => setData(data))
    }, [])

    return (
        <BoxItemsContainer
            data={_data}
            isOpen={isOpen}
            resourceUrl="actividades"
            template={{
                displayType: "vertical",
                itemAccess: {
                    image: "foto",
                    title: "titulo",
                    to: "slug"
                }
            }} />
    )
}