import {getDistricts} from '../api/GETs'
import Pages from '../components/pages'

export async function getServerSideProps() {
    let result = undefined

    await getDistricts().then(data => result = data)

    return {
        props: {
            districts: result.map(val => val.nombre)
        }
    }
}

export default function Home(props) {
  return (
    <Pages {...props}/>
  )
}
