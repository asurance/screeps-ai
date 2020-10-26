import { DefineGlobalCmd } from './util/util'

export const SpawnMap = new Map<string, string[]>()
export const CreepMap = new Map<string, string[]>()

let isReset = true

DefineGlobalCmd('SpawnMap', () => {
    SpawnMap.forEach((spawns, room) => {
        console.log(room, JSON.stringify(spawns))
    })
})
DefineGlobalCmd('CreepMap', () => {
    CreepMap.forEach((spawns, room) => {
        console.log(room, JSON.stringify(spawns))
    })
})

function InitMap() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        const list = SpawnMap.get(spawn.room.name)
        if (list) {
            list.push(spawn.name)
        } else {
            SpawnMap.set(spawn.room.name, [spawn.name])
        }
        if (spawn.memory.roomName !== spawn.room.name) {
            spawn.memory.roomName = spawn.room.name
        }
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        const list = CreepMap.get(creep.room.name)
        if (list) {
            list.push(creep.name)
        } else {
            CreepMap.set(creep.room.name, [creep.name])
        }
        if (creep.memory.roomName !== creep.room.name) {
            creep.memory.roomName = creep.room.name
        }
    }
    isReset = false
}

function UpdateMap() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        if (spawn.memory.roomName !== spawn.room.name) {
            let list = SpawnMap.get(spawn.memory.roomName)
            if (list) {
                const index = list.indexOf(spawn.name)
                if (index >= 0) {
                    list.splice(index, 1)
                }
            }
            list = SpawnMap.get(spawn.room.name)
            if (list) {
                list.push(spawn.name)
            } else {
                SpawnMap.set(spawn.room.name, [spawn.name])
            }
            spawn.memory.roomName = spawn.room.name
        }
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.roomName !== creep.room.name) {
            let list = CreepMap.get(creep.memory.roomName)
            if (list) {
                const index = list.indexOf(creep.name)
                if (index >= 0) {
                    list.splice(index, 1)
                }
            }
            list = CreepMap.get(creep.room.name)
            if (list) {
                list.push(creep.name)
            } else {
                CreepMap.set(creep.room.name, [creep.name])
            }
            creep.memory.roomName = creep.room.name
        }
    }
}

export function Scan(): void {
    if (isReset) {
        InitMap()
    } else {
        UpdateMap()
    }
}