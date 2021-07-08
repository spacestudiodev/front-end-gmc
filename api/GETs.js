import { urlServerApi } from "./server";

const GET = (url) => new Promise((resolve, reject) => fetch(`${urlServerApi}/${url}`)
    .then(response => response.json())
    .then(data => resolve(data))
    .catch(err => reject(err))
)

export const getListNewFindings = () => GET(`api/NuevoHallazgo/get`)
export const getListCulturalActivities = () => GET(`api/Actividades/listado_tipo`)
export const getListPublications = () => GET(`api/Publicaciones/listado`)
export const getDistricts = () => GET("api/Distrito/listado")
