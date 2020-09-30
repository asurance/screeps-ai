const roomInfo = new Map<string, RoomInfo>()

export interface RoomInfo {
    sourceInfo: Id<Source>[]
    creepInfo: (string | null)[],
}

/**
 * 获取房间信息
 * @param room 房间
 */
export function GetRoomInfo(room: Room): RoomInfo {
    let info = roomInfo.get(room.name)
    if (!info) {
        const sourceInfo = room.find(FIND_SOURCES).map(source => source.id)
        info = {
            sourceInfo,
            creepInfo: new Array<string | null>(sourceInfo.length).fill(null),
        }
        roomInfo.set(room.name, info)
    }
    return info
}

export function OnCreepDead(roomName: string, creepName: string): boolean {
    const info = roomInfo.get(roomName)
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
