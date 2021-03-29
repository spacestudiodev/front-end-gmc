import { getListPublications } from "../api/GETs";
import Home from "../components/pages";

export async function getServerSideProps() {
    let result = undefined

    await getListPublications().then(data => result = data)

    return {
        props: {
            data: result
        }
    }
}

export default function Publications({ asPath, data }) {
    return (
        <Home asPath={asPath} publications={data} />
    )
}