import { BaseCreep, BaseCreepCtor } from './baseCreep'
import { Builder } from './builder'
import { Harvester } from './harvester'
import { Upgrader } from './upgrader'

for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key]
    }
}

const creepCtorMap: { [key in CreepType]: BaseCreepCtor<CreepType> } = {
    harvester: Harvester,
    upgrader: Upgrader,
    builder: Builder,
}

const creepMap = new Map<CreepType, BaseCreep[]>()

for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName] as Creep<MemoryData>
    const type = creep.memory.type
    const handler = new creepCtorMap[type]()
    handler.creep = creep
    if (creepMap.has(type)) {
        creepMap.get(type)!.push(handler)
    } else {
        creepMap.set(type, [handler])
    }
}

let spawning: CreepType | null = null

const list = [CreepType.Harvester, CreepType.Upgrader, CreepType.Builder]
for (let i = 0; i < list.length; i++) {
    const l = creepMap.get(list[i])
    if (!l) {
        spawning = list[i]
        break
    }
}
if (spawning === null) {
    creepMap.forEach((creeps, type) => {
        let flag = true
        for (let i = 0; i < creeps.length; i++) {
            flag = creeps[i].ticker() && flag
        }
        if (!flag) {
            const index = list.indexOf(type)
            if (index >= 0) {
                list.splice(index, 1)
            }
        }
    })
    spawning = list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null
} else {
    creepMap.forEach(creeps => creeps.forEach(creep => creep.ticker()))
}

for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName]
    if (spawning !== null) {
        const ctor = creepCtorMap[spawning]
        if (spawn.room.energyAvailable >= ctor.minEnergy) {
            const creep = new ctor()
            const reuslt = creep.create(spawn, spawn.room.energyAvailable)
            if (reuslt !== OK) {
                console.log(reuslt)
            }
        }
    }
}

Game.killAllCreeps = () => {
    for (const name in Game.creeps) {
        Game.creeps[name].suicide()
        delete Memory.creeps[name]
    }
}