import { getListNewFindings } from "../api/GETs";
import Home from "../components/pages";

export async function getServerSideProps() {
    let result = undefined

    await getListNewFindings().then(data => result = data)

    return {
        props: {
            data: result
        }
    }
}

export default function NewFindings({ asPath, data }) {
    return (
        <Home asPath={asPath} newFindings={data} />
    )
}