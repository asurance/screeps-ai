export function RandomInt(max: number, min = 0): number {
    return min + Math.floor(Math.random() * (max - min))
}

export function RandomObjectInList<T>(list: T[]): T | null {
    if (list.length > 0) {
        return list[Math.floor(Math.random() * list.length)]
    } else {
        return null
    }
}