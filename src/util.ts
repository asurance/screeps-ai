/**
 * 随机整数
 * @param max 最大值
 * @param min 最小值,默认为0
 * @return 随机结果
 */
export function RandomInt(max: number, min = 0): number {
    return min + Math.floor(Math.random() * (max - min))
}

/**
 * 在列表中随机一个元素
 * @param list 列表
 * @return 列表长度为0,返回null,反之返回随机的元素
 */
export function RandomObjectInList<T>(list: T[]): T | null {
    if (list.length > 0) {
        return list[Math.floor(Math.random() * list.length)]
    } else {
        return null
    }
}

/**
 * 获取对应组件所需的能量
 * @param body 组件列表
 * @return 所及能量
 */
export function GetRequiredEnergy(body: BodyPartConstant[]): number {
    return body.reduce((pre, cur) => {
        return pre + BODYPART_COST[cur]
    }, 0)
}

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

export function MoveToTarget(creep: Creep, target: RoomPosition, range: number, inRange: () => void): void {
    const distance = creep.pos.getRangeTo(target)
    if (distance <= range) {
        inRange()
    } else {
        const result = creep.moveTo(target, { noPathFinding: true })
        if (result === ERR_NOT_FOUND) {
            creep.moveTo(target, { reusePath: range, range, serializeMemory: false })
        }
    }
}