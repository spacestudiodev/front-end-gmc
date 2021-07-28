import { useEffect, useState } from "react";
import { getListNewFindings } from "../../api/GETs";
import BoxItemsContainer from "../templates/BoxItemsContainer";

export default function NewFindingsPage({ data, isOpen }) {
    const [_data, setData] = useState(data)

    useEffect(() => {
        if (!_data)
            getListNewFindings().then(data => setData(data))
    })

    return (
        <BoxItemsContainer
            data={_data}
            isOpen={isOpen}
            resourceUrl="NuevosHallazgos"
            template={{
                displayType: "horizontal",
                itemAccess: {
                    image: "foto",
                    title: "nombre",
                    description: "contenido",
                    to: "slug",
                    canShare: true
                }
            }} />
    )
}
