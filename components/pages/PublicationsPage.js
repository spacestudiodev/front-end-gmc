import { useEffect, useState } from "react"
import { getListPublications } from "../../api/GETs"
import PDFItems from "../templates/PDFItems"

export default function PublicationsPage({ data, isOpen }) {
    const [_data, setData] = useState(data)

    useEffect(() => {
        if (!_data)
            getListPublications().then(data => setData(data))
    }, [])

    return (
        <PDFItems
            data={_data}
            isOpen={isOpen}
            imagesUrl="publicaciones"
            downloadUrl="publicaciones"
            template={{
                itemAccess: {
                    image: "foto",
                    title: "titulo",
                    download: "archivo"
                }
            }} />
    )
}
