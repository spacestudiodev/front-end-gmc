export function lerp(curr, to, i) {
    let result = curr * (1 - i) + to * i
    if(getDif(curr, to) < 0.0001) return to
    return result 
}

export function getDif(a, b){
    let result = a

    if(a > b)
        result = a - b
    if(a < b)
        result = b - a

    return result
}

export function clamp (current, min, max) {
    return Math.min(Math.max(current, min), max)
}
