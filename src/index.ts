import { CreepController } from './creepController'
import { HarvesterController } from './harvesterController'
import { UpgraderController } from './upgraderController'
import { BuilderController } from './builderController'
import { RepairController } from './repairerController'
import { RandomObjectInList } from './util'
import './patch'
import { TransferController } from './transferController'

const creepControllerMap: { [key in CreepType]: CreepController<CreepType> } = {
    harvester: HarvesterController,
    transfer: TransferController,
    upgrader: UpgraderController,
    builder: BuilderController,
    repairer: RepairController,
}

const creepMap = new Map<CreepType, Creep[]>()

// 删除过期数据
for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key]
    }
}

// 数据预处理
for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName] as Creep<CreepMemoryData>
    const list = creepMap.get(creep.memory.type)
    if (list) {
        list.push(creep)
    } else {
        creepMap.set(creep.memory.type, [creep])
    }
}

let spawning: CreepType | null = null

const spawn = Game.spawns['Home']

// 塔设置
const towers = spawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_TOWER
        && structure.my
}) as StructureTower[]
towers.forEach(tower => {
    const hostTile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (hostTile) {
        hostTile.attack(hostTile)
    }
})

const list = [CreepType.Harvester, CreepType.Transfer, CreepType.Upgrader, CreepType.Builder, CreepType.Repairer]

// 最少生成一项
for (let i = 0; i < list.length; i++) {
    const l = creepMap.get(list[i])
    if (l) {
        if (l.length >= 10) {
            list.splice(i, 1)
            i--
        }
    } else {
        spawning = list[i]
        break
    }
}
// 操作并且对闲置计数
creepMap.forEach((creeps, type) => {
    let count = Memory[type] ?? 0
    count -= 5
    for (let i = 0; i < creeps.length; i++) {
        count += creepControllerMap[creeps[i].memory.type].ticker(creeps[i])
    }
    if (count <= 0) {
        delete Memory[type]
    } else {
        Memory[type] = count
        const index = list.indexOf(type)
        if (index >= 0) {
            list.splice(index, 1)
        }
    }
})

// 生成新creeps
if (spawning === null) {
    spawning = RandomObjectInList(list)
}
if (spawning !== null) {
    const controller = creepControllerMap[spawning]
    if (spawn.room.energyAvailable >= controller.minEnergy) {
        const name = `${spawning}-${spawn.name}-${Game.time}`
        const result = controller.create(spawn, name, spawn.room.energyAvailable)
        if (result === OK) {
            Game.creeps[name].memory.type = controller.type
        } else {
            Game.notify(`spawn object fail:${spawning} ${name} ${result}`, 60)
        }
    }
}