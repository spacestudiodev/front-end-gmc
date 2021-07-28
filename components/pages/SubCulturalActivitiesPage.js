import {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {getListSubCulturalActivities} from "../../api/GETs";
import BoxItemsContainer from "../templates/BoxItemsContainer";
import Simplemodal from "../UI/simplemodal";

export default function CulturalActivitiesPage({data, isOpen, params, match}) {
    const history = useHistory()
    const [_data, setData] = useState(data)
    const [datacache, setDatacache] = useState({})
    const [hashActive, setHashActive] = useState(location.hash)
    const [dataHash, setDataHash] = useState()

    const [_params, setParams] = useState(params)

    const getData = () => {
        if (datacache[params.type]) {
            setData(datacache[params.type])
            getDataHash(hashActive, datacache[params.type])
        }
        else {
            const currentParams = params

            getListSubCulturalActivities(params.type).then(data => {
                setData(data)
                setDatacache({...datacache, [currentParams.type]: data})
                getDataHash(hashActive, data)
            })
        }
    }

    const getDataHash = (h, d) => {
        if (h !== "") {
            let len = d?.length
            while (len--) {
                if (d[len].id == h) {
                    setDataHash(d[len])
                    break
                }
            }
        }
    }

    useEffect(() => {
        if (!_data && params) {
            getData()
        }
    }, [])

    useEffect(() => {
        if (params) {
            if (params.type && _params !== params) {
                setParams(params)
                setData(undefined)
                getData()
            }
        }
    }, [params])

    useEffect(() => {
        const currentHash = location.hash.substring(1)
        setHashActive(currentHash)
        getDataHash(currentHash, _data)
    }, [location.hash])

    return (
        <div>
            <BoxItemsContainer
                data={_data}
                isOpen={isOpen}
                variantsContainer={{
                    close: {
                        transition: {
                            delayChildren: 0,
                            staggerChildren: 0.0,
                        },
                    },
                }}
                duration={!isOpen ? 0.2 : 0.25}
                resourceUrl={`actividades/${_params?.type}`}
                template={{
                    displayType: "horizontal",
                    itemAccess: {
                        image: (item) => item.foto.split("|")[0],
                        title: "titulo",
                        description: "descripcion",
                        toHash: () => (item) => {
                            history.replace(`#${item.id}`)
                        },
                        canShare: true,
                    }
                }} />

            <Simplemodal
                isOpen={hashActive !== undefined && hashActive !== ""}
                onExit={() => history.replace(location.pathname)}
                data={dataHash}
                urlImages={`actividades/${_params?.type}`}
            />
        </div>
    )
}
