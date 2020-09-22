import './patch'
import './global'
import { IStrategy } from './strategy/strategy'
import { Harvester } from './strategy/harvester'
import { ICommand } from './command/command'
import { Harvest } from './command/harvest'
import { config } from './config'
import { RandomObjectInList } from './util'
import { creepInfo } from './global'
import { UpdateController } from './command/upgradeController'
import { Transfer } from './command/transfer'
import { Pickup } from './command/pickup'
import { Transferer } from './strategy/transferer'
import { Worker } from './strategy/worker'
import { Withdraw } from './command/withdraw'
import { Build } from './command/build'
import { Repair } from './command/repair'

// 删除过期数据
for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key]
    }
}

// 数据
const strategyMap: { [key in Strategy]: IStrategy } = {
    harvester: Harvester,
    transferer: Transferer,
    worker: Worker,
}
const commandMap: { [key in Command]: ICommand } = {
    harvest: Harvest,
    updateController: UpdateController,
    transfer: Transfer,
    pickup: Pickup,
    withdraw: Withdraw,
    build: Build,
    repair: Repair,
}
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

// creep操作
for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (!creep.spawning) {
        const strategyType = creep.memory.strategy.type
        if (creep.memory.cmd) {
            const commandType = creep.memory.cmd.type
            // @ts-expect-error ts暂时无法识别该类型
            strategyMap[strategyType].callbackMap[commandType](creep, commandMap[commandType](creep))
        } else {
            strategyMap[strategyType].start(creep)
        }
    }
}

// 生成新creep
if (!spawn.spawning) {
    let spawing: Strategy | null = null
    let list = [Strategy.Harvester, Strategy.Transferer, Strategy.Worker]
    for (let i = 0; i < list.length; i++) {
        const map = creepInfo.get(list[i])
        if (map) {
            let sum = 0
            map.forEach(v => sum += v.length)
            if (sum >= config[list[i]]) {
                list.splice(i, 1)
                i--
            }
        } else {
            spawing = list[i]
            break
        }
    }
    if (spawing) {
        if (spawn.room.energyAvailable < strategyMap[spawing].minEnergy) {
            spawing = null
        }
    } else {
        list = list.filter(s => spawn.room.energyAvailable >= strategyMap[s].minEnergy)
        spawing = RandomObjectInList(list)
    }
    if (spawing) {
        const name = `${spawn.name}-${spawing}-${Game.time}`
        const result = spawn.spawnCreep(strategyMap[spawing].create(spawn.room.energyAvailable), name)
        if (result === OK) {
            const creep = Game.creeps[name]
            creep.memory.strategy = {
                type: spawing
            }
            strategyMap[spawing].initStrategy(creep)
        } else {
            Game.notify(`spawn creep fail with code:${result}`, config.notifyInterval)
        }
    }
}