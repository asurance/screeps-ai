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
