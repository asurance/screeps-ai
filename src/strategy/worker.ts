import { SetNextCommand } from '../command/command'
import { checkMoveFail, initMoveCache, MoveCacheData } from '../moveCache'
import { IStrategy } from './strategy'
import { GetRequiredEnergy, RandomObjectInList, } from '../util'
import { WithdrawResult } from '../command/withdraw'
import { UpdateControllerResult } from '../command/upgradeController'
import { BuildResult } from '../command/build'
import { RepairResult } from '../command/repair'
import { creepInfo } from '../global'

/**
 * 采集者数据
 */
interface WorkerData extends StrategyData {
    type: Strategy.Worker
    moveCache: MoveCacheData
}

/**
 * 采集者策略
 */
export const Worker: IStrategy = {
    minEnergy: GetRequiredEnergy([MOVE, WORK, CARRY]),
    create(maxEnergy: number) {
        const count = Math.min(4, Math.floor(maxEnergy / (BODYPART_COST.work + BODYPART_COST.move + BODYPART_COST.carry)))
        const body: BodyPartConstant[] = []
        for (let i = 0; i < count; i++) {
            body.push(MOVE, WORK, CARRY)
        }
        return body
    },
    initStrategy(creep: Creep) {
        const strategy = creep.memory.strategy as WorkerData
        strategy.moveCache = initMoveCache(creep)
    },
    start(creep: Creep) {
        FindWithdrawTarget(creep)
    },
    callbackMap: {
        [Command.Withdraw]: (creep: Creep, result: WithdrawResult): void => {
            const strategy = creep.memory.strategy as WorkerData
            switch (result) {
                case WithdrawResult.TargetLost:
                case WithdrawResult.TargetNeedReplace:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep)
                    } else {
                        FindWithdrawTarget(creep)
                    }
                    break
                case WithdrawResult.Full:
                    FindNextWork(creep)
                    break
                case WithdrawResult.Moving:
                    if (checkMoveFail(creep, strategy.moveCache)) {
                        FindRandomWithdrawTarget(creep)
                    }

            }
        },
        [Command.UpgradeController]: (creep: Creep, result: UpdateControllerResult): void => {
            const strategy = creep.memory.strategy as WorkerData
            switch (result) {
                case UpdateControllerResult.Moving:
                    if (checkMoveFail(creep, strategy.moveCache)) {
                        FindNextWork(creep)
                    }
                    break
                case UpdateControllerResult.RequireMoreEnergy:
                    FindWithdrawTarget(creep)
                    break
            }
        },
        [Command.Build]: (creep: Creep, result: BuildResult): void => {
            const strategy = creep.memory.strategy as WorkerData
            switch (result) {
                case BuildResult.TargetNeedReplace:
                case BuildResult.TargetLost:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep)
                    } else {
                        FindWithdrawTarget(creep)
                    }
                    break
                case BuildResult.Moving:
                    if (checkMoveFail(creep, strategy.moveCache)) {
                        FindNextWork(creep)
                    }
                    break
                case BuildResult.RequireMoreEnergy:
                    FindWithdrawTarget(creep)
                    break
            }
        },
        [Command.Repair]: (creep: Creep, result: RepairResult): void => {
            const strategy = creep.memory.strategy as WorkerData
            switch (result) {
                case RepairResult.TargetNeedReplace:
                case RepairResult.TargetLost:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep)
                    } else {
                        FindWithdrawTarget(creep)
                    }
                    break
                case RepairResult.Moving:
                    if (checkMoveFail(creep, strategy.moveCache)) {
                        FindNextWork(creep)
                    }
                    break
                case RepairResult.RequireMoreEnergy:
                    FindWithdrawTarget(creep)
                    break
            }
        },
    },
}

function FindWithdrawTarget(creep: Creep): boolean {
    let target: StructureContainer | StructureStorage | Ruin | Tombstone | null
        = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (tombstone) => tombstone.store.energy > 0 })
    if (target === null) {
        target = creep.pos.findClosestByPath(FIND_RUINS, { filter: (ruin) => ruin.store.energy > 0 })
    }
    if (target === null) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) =>
                ((structure.structureType === STRUCTURE_CONTAINER)
                    || (structure.structureType === STRUCTURE_STORAGE && structure.my))
                && structure.store.energy > 0
        }) as StructureContainer | StructureStorage
    }
    if (target) {
        SetNextCommand(Command.Withdraw, creep, target)
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}

function FindRandomWithdrawTarget(creep: Creep): boolean {
    const targets: (StructureContainer | StructureStorage | Ruin | Tombstone | null)[]
        = creep.room.find(FIND_TOMBSTONES, { filter: (tombstone) => tombstone.store.energy > 0 })
    targets.push(...creep.room.find(FIND_RUINS, { filter: (ruin) => ruin.store.energy > 0 }))
    targets.push(...creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
            ((structure.structureType === STRUCTURE_CONTAINER)
                || (structure.structureType === STRUCTURE_STORAGE && structure.my))
            && structure.store.energy > 0
    }) as (StructureContainer | StructureStorage)[])
    const target = RandomObjectInList(targets)
    if (target) {
        SetNextCommand(Command.Withdraw, creep, target)
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}

function FindBuildTarget(creep: Creep): boolean {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: (constructionSite) => constructionSite.progress < constructionSite.progressTotal
    })
    if (targets.length > 0) {
        const target = targets.reduce((pre, cur) => {
            if (pre.progressTotal < cur.progressTotal / 10) {
                return pre
            } else if (cur.progressTotal < pre.progressTotal / 10) {
                return cur
            }
            else {
                return pre.progress / pre.progressTotal > cur.progress / cur.progressTotal ?
                    pre : cur
            }
        })
        SetNextCommand(Command.Build, creep, target)
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}

function FindRepairTarget(creep: Creep): boolean {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure => structure.hits < structure.hitsMax)
    })
    if (targets.length > 0) {
        const target = targets.reduce((pre, cur) => {
            if (pre.hits < 1000 && cur.hits < 1000) {
                return pre < cur ? pre : cur
            } else {
                if (pre.hits < 1000) {
                    return pre
                }
                if (cur.hits < 1000) {
                    return cur
                }
                return pre.hits / pre.hitsMax < cur.hits / cur.hitsMax ?
                    pre : cur
            }
        })
        SetNextCommand(Command.Repair, creep, target)
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}

function FindUpgradeTarget(creep: Creep): boolean {
    if (creep.room.controller) {
        SetNextCommand(Command.UpgradeController, creep)
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}

const cmds = [Command.UpgradeController, Command.Build, Command.Repair]
const fns = [FindUpgradeTarget, FindBuildTarget, FindRepairTarget]

function FindNextWork(creep: Creep): boolean {
    const counts = [0, 0, 0]
    const rest = []
    const workers = creepInfo.get(Strategy.Worker)
    if (workers) {
        cmds.forEach((cmd, index) => {
            const l = workers.get(cmd)
            if (l) {
                counts[index] = l.length
            }
        })
    }
    const index = cmds.indexOf(creep.memory.cmd!.type)
    if (index >= 0) {
        counts[index]--
    }
    for (let i = 0; i < counts[i]; i++) {
        if (counts[i] === 0) {
            const result = fns[i](creep)
            if (result) {
                return true
            }
        } else {
            rest.push(i)
        }
    }
    let id = RandomObjectInList(rest)
    while (id !== null) {
        const result = fns[id](creep)
        if (result) {
            return true
        }
        const index = rest.indexOf(id)
        rest.splice(index, 1)
        id = RandomObjectInList(rest)
    }
    return false
}