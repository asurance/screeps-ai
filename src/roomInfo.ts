/**
 * 获取房间信息
 * @param room 房间
 */
export function GetRoomInfo(room: Room): RoomMemory {
    if (!room.memory.sourceInfo) {
        room.memory.sourceInfo = room.find(FIND_SOURCES).map(source => source.id)
        room.memory.creepInfo = new Array<string | null>(room.memory.sourceInfo.length).fill(null)
    }
    return room.memory
}

export function OnCreepDead(room: Room, creepName: string): boolean {
    if (room.memory.creepInfo) {
        const index = room.memory.creepInfo.indexOf(creepName)
        if (index >= 0) {
            room.memory.creepInfo[index] = null
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
