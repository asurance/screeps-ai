import { CreepController } from './creepController'
import { HarvesterController } from './harvesterController'
import { UpgraderController } from './upgraderController'
import { BuilderController } from './builderController'
import { RepairController } from './repairerController'
import { RandomObjectInList } from './util'
import './patch'

for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key]
    }
}

const creepControllerMap: { [key in CreepType]: CreepController<CreepType> } = {
    harvester: HarvesterController,
    upgrader: UpgraderController,
    builder: BuilderController,
    repairer: RepairController,
}

const creepMap = new Map<CreepType, Creep[]>()

for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName] as Creep<MemoryData>
    const list = creepMap.get(creep.memory.type)
    if (list) {
        list.push(creep)
    } else {
        creepMap.set(creep.memory.type, [creep])
    }
}

let spawning: CreepType | null = null

const spawn = Game.spawns['Home']

const list = [CreepType.Harvester, CreepType.Upgrader, CreepType.Builder]
for (let i = 0; i < list.length; i++) {
    const l = creepMap.get(list[i])
    if (l) {
        if (l.length >= 5) {
            list.splice(i, 1)
            i--
        }
    } else {
        spawning = list[i]
        break
    }
}
if (spawning === null && list.length > 0) {
    creepMap.forEach((creeps, type) => {
        let flag = true
        for (let i = 0; i < creeps.length; i++) {
            flag = creepControllerMap[creeps[i].memory.type].ticker(creeps[i]) && flag
        }
        if (!flag) {
            const index = list.indexOf(type)
            if (index >= 0) {
                list.splice(index, 1)
            }
        }
    })
    spawning = RandomObjectInList(list)
} else {
    creepMap.forEach(creeps => creeps.forEach(creep => creepControllerMap[creep.memory.type].ticker(creep)))
}

if (spawning !== null) {
    const controller = creepControllerMap[spawning]
    if (spawn.room.energyAvailable >= controller.minEnergy) {
        const name = `${spawn.name}-${Game.time}`
        const result = controller.create(spawn, name, spawn.room.energyAvailable)
        if (result === OK) {
            Game.creeps[name].memory.type = controller.type
        } else {
            Game.notify(`spawn object fail:${spawning} ${name} ${result}`, 60)
        }
    }
}