import { AddToMapList, DeleteFromMapList } from './util/util'

export const SpawnMap = new Map<string, string[]>()
export const CreepMap = new Map<string, string[]>()

let skipScan = true

for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName]
    AddToMapList(SpawnMap, spawn.room.name, spawn.name)
    if (spawn.memory.roomName !== spawn.room.name) {
        spawn.memory.roomName = spawn.room.name
    }
}
for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName]
    AddToMapList(CreepMap, creep.room.name, creep.name)
    if (creep.memory.roomName !== creep.room.name) {
        creep.memory.roomName = creep.room.name
    }
}

export function Scan(): void {
    if (skipScan) {
        skipScan = false
        return
    }
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        if (spawn.memory.roomName !== spawn.room.name) {
            DeleteFromMapList(SpawnMap, spawn.memory.roomName, spawn.name)
            AddToMapList(SpawnMap, spawn.room.name, spawn.name)
            spawn.memory.roomName = spawn.room.name
        }
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.roomName !== creep.room.name) {
            DeleteFromMapList(CreepMap, creep.memory.roomName, creep.name)
            AddToMapList(CreepMap, creep.room.name, creep.name)
            creep.memory.roomName = creep.room.name
        }
    }
}

export function OnCreepDead(creepName: string, roomName: string): void {
    DeleteFromMapList(CreepMap, roomName, creepName)
}