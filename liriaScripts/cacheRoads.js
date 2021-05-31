export default class CacheRoads {
    constructor() {
        this.loading = true
        this.roads = {}

        fetch("/map/json/miniroads.json")
            .then(res => res.json())
            .then(json => {
                this.loading = false
                this.roads = {...json}
            })
    }

    get(li, pos){
        return this.roads[pos / li]
    }

    add(li, x, y) {
        const roads = get(li, x * y)

        for(let i = 0; i < roads.length; i++) {
            const road = roads[i]
        }
    }

    delete(li, x, y) {

    }
}
