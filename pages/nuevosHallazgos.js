import Home from "../components/pages";

export async function getServerSideProps(context) {
    console.log("hi")
    return {
        props: {
            // props for your component
        }
    }
}

export default function NewFindings({ asPath }) {
    return (
        <Home asPath={asPath} />
    )
}