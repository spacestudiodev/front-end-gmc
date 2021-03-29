import { getListCulturalActivities } from "../api/GETs";
import Home from "../components/pages";

export async function getServerSideProps() {
    let result = undefined

    await getListCulturalActivities().then(data => result = data)

    return {
        props: {
            data: result
        }
    }
}

export default function CulturalActivities({ asPath, data }) {
    return (
        <Home asPath={asPath} culturalActivities={data} />
    )
}