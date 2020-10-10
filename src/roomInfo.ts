export interface RoomInfo {
    spawn: string[]
    creep: string[]
}

export const RoomInfoMap = GenerateRoomInfomap()

function GenerateRoomInfomap() {
    const map = new Map<string, RoomInfo>()
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName]
        map.set(room.name, { spawn: [], creep: [] })
    }
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        const roomInfo = map.get(spawn.room.name)!
        roomInfo.spawn.push(spawn.name)
        spawn.memory.roomName = spawn.room.name
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        const roomInfo = map.get(creep.room.name)!
        roomInfo.creep.push(creep.name)
        creep.memory.roomName = creep.room.name
    }
    return map
}

export class RoomInfoHandler {
    private infoMap = new Map<string, RoomInfo>()
    constructor() {
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName]
            this.infoMap.set(room.name, { spawn: [], creep: [] })
        }
        for (const spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName]
            const roomInfo = this.infoMap.get(spawn.room.name)!
            roomInfo.spawn.push(spawn.name)
            spawn.memory.roomName = spawn.room.name
        }
        for (const creepName in Game.creeps) {
            const creep = Game.creeps[creepName]
            const roomInfo = this.infoMap.get(creep.room.name)!
            roomInfo.creep.push(creep.name)
            creep.memory.roomName = creep.room.name
        }
    }
    update(): void {
        for (const creepName in Memory.creeps) {
            if (!(creepName in Game.creeps)) {
                const roomName = Memory.creeps[creepName].roomName
                const roomInfo = this.infoMap.get(roomName)
                if (roomInfo) {
                    const index = roomInfo.creep.indexOf(creepName)
                    if (index >= 0) {
                        roomInfo.creep.splice(index, 1)
                    }
                }
                delete Memory.creeps[creepName]
            }
        }
        for (const spawnName in Memory.spawns) {
            if (!(spawnName in Game.spawns)) {
                const roomName = Memory.spawns[spawnName].roomName
                const roomInfo = this.infoMap.get(roomName)
                if (roomInfo) {
                    const index = roomInfo.spawn.indexOf(spawnName)
                    if (index >= 0) {
                        roomInfo.spawn.splice(index, 1)
                    }
                }
                delete Memory.spawns[spawnName]
            }
        }
    }
    getRoomInfo(roomName: string): Readonly<RoomInfo> | null {
        return this.infoMap.get(roomName) ?? null
    }
}

export const roomInfo = new RoomInfoHandler()
