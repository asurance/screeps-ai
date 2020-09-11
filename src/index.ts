import { BaseCreep, BaseCreepCtor } from './baseCreep'
import { Carrier } from './carrier'
import { Walker } from './walker'
import { Worker } from './worker'

for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key]
    }
}

const creepCtorMap: { [key in CreepType]: BaseCreepCtor<CreepType> } = {
    worker: Worker,
    walker: Walker,
    carrier: Carrier,
}

if (!Memory.ctors) {
    Memory.ctors = {
        walker: 0,
        carrier: 0,
        worker: 0,
    }
}

for (const key in creepCtorMap) {
    const ctor = creepCtorMap[key as CreepType]
    ctor.deserialize(Memory.ctors[key as CreepType])
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

for (const spawnName in Game.spawns) {
    const span = Game.spawns[spawnName]
    const workerList = creepMap.get(CreepType.Worker)
    if (!workerList) {
        if (!span.spawning && span.room.energyAvailable >= Worker.minEnergy) {
            const worker = new Worker()
            const result = worker.create(span, span.room.energyAvailable)
            if (result !== OK) {
                console.log(result)
            } else {
                continue
            }
        }
    }
    const carrierList = creepMap.get(CreepType.Carrier)
    if (!carrierList) {
        if (!span.spawning && span.room.energyAvailable >= Carrier.minEnergy) {
            const carrier = new Carrier()
            const result = carrier.create(span, span.room.energyAvailable)
            if (result !== OK) {
                console.log(result)
            } else {
                continue
            }
        }
    }
    const walkerList = creepMap.get(CreepType.Walker)
    if (!walkerList) {
        if (!span.spawning && span.room.energyAvailable >= Walker.minEnergy) {
            const walker = new Walker()
            const result = walker.create(span, span.room.energyAvailable)
            if (result !== OK) {
                console.log(result)
            } else {
                continue
            }
        }
    }
}

creepMap.forEach(creeps => creeps.forEach(creep => creep.ticker()))

for (const key in creepCtorMap) {
    const ctor = creepCtorMap[key as CreepType]
    Memory.ctors[key as CreepType] = ctor.serialize()
}