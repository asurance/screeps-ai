/**
 * 获取房间信息
 * @param room 房间
 */
export function GetRoomInfo(room: Room): RoomMemory {
    let info = room.memory
    if (!info) {
        const sourceInfo = room.find(FIND_SOURCES).map(source => source.id)
        info = {
            sourceInfo,
            creepInfo: new Array<string | null>(sourceInfo.length).fill(null),
        }
        room.memory = info
    }
    return info
}

export function OnCreepDead(room:Room, creepName: string): boolean {
    const info = room.memory
    if (info) {
        const index = info.creepInfo.indexOf(creepName)
        if (index >= 0) {
            info.creepInfo.splice(index, 1)
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
