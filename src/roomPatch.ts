export function LookForInRange<T extends keyof AllLookAtTypes>(
    type: T,
    obj: RoomObject,
    range: number,
): LookForAtAreaResultArray<AllLookAtTypes[T], T> {
    if (obj.room) {
        const top = Math.max(obj.pos.y - range, 0)
        const left = Math.max(obj.pos.x - range, 0)
        const bottom = Math.min(obj.pos.y + range, 49)
        const right = Math.min(obj.pos.x + range, 49)
        return obj.room.lookForAtArea(type, top, left, bottom, right, true)
    } else {
        return []
    }
}