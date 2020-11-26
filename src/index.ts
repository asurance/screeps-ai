import './patch'
import { IStrategy } from './strategy/strategy'
import { Harvester } from './strategy/harvester'
import { ICommand } from './command/command'
import { Harvest } from './command/harvest'
import { config } from './config'
import { RandomObjectInList } from './util'
import { OnCreepDead } from './roomInfo'
import { UpdateController } from './command/upgradeController'
import { Transfer } from './command/transfer'
import { Pickup } from './command/pickup'
import { Transferer } from './strategy/transferer'
import { Worker } from './strategy/worker'
import { Withdraw } from './command/withdraw'
import { Build } from './command/build'
import { Repair } from './command/repair'
import { deal } from './deal'

/**
 * creep信息
 */
export let creepInfo = CreateCreepInfo()

function CreateCreepInfo(): Map<Strategy, Map<Command | null, Creep[]>> {
    const creepInfo = new Map<Strategy, Map<Command | null, Creep[]>>()
    // 数据预处理
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        let map = creepInfo.get(creep.memory.strategy.type)
        if (!map) {
            map = new Map<Command | null, Creep[]>()
            creepInfo.set(creep.memory.strategy.type, map)
        }
        const key = creep.memory.cmd?.type ?? null
        const list = map.get(key)
        if (list) {
            list.push(creep)
        } else {
            map.set(key, [creep])
        }
    }
    return creepInfo
}

let isReset = true

export function loop(): void {
    if (isReset) {
        console.log('Reset')
        Game.notify('Reset', 3600)
        isReset = false
    }
    const spawn = Game.spawns['Home']

    // 删除过期数据
    for (const key in Memory.creeps) {
        if (!(key in Game.creeps)) {
            delete Memory.creeps[key]
            OnCreepDead(spawn.room, key)
        }
    }
    creepInfo = CreateCreepInfo()

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

    // 塔设置
    const towers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TOWER
            && structure.my
    }) as StructureTower[]
    towers.forEach(tower => {
        if (tower.store.energy >= TOWER_CAPACITY / 2) {
            const creep = RandomObjectInList(tower.pos.findInRange(FIND_CREEPS, TOWER_OPTIMAL_RANGE, {
                filter: creep => creep.hits < creep.hitsMax
            }))
            if (creep) {
                tower.heal(creep)
            }
            const structure = RandomObjectInList(tower.pos.findInRange(FIND_STRUCTURES, TOWER_OPTIMAL_RANGE, {
                filter: structure => structure.hits < structure.hitsMax
            }))
            if (structure) {
                tower.repair(structure)
            }
        }
        const hostTile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (hostTile) {
            tower.attack(hostTile)
        }
    })

    // creep操作
    for (const name in Game.creeps) {
        const creep = Game.creeps[name]
        if (!creep.spawning) {
            const strategy = strategyMap[creep.memory.strategy.type]
            if (creep.memory.cmd) {
                const commandType = creep.memory.cmd.type
                if (commandType in strategy.callbackMap) {
                    // @ts-expect-error ts暂时无法识别该类型
                    strategy.callbackMap[commandType](creep, commandMap[commandType](creep))
                } else {
                    commandMap[commandType](creep)
                }
            } else {
                strategy.start(creep)
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
            }
        }
    }

    // 回收多余能量
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName]
        if (room.terminal && room.terminal.store.energy > room.terminal.store.getFreeCapacity(RESOURCE_ENERGY)) {
            deal(room)
        }
    }

    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 1000) {
        Game.cpu.generatePixel()
    }
}