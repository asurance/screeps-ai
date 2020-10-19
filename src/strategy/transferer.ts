import { SetNextCommand } from '../command/command'
import { checkMoveFail, initMoveCache, MoveCacheData } from '../moveCache'
import { PickupResult } from '../command/pickup'
import { IStrategy } from './strategy'
import { TransferResult } from '../command/transfer'
import { GetRequiredEnergy, RandomObjectInList } from '../util'

/**
 * 运输者数据
 */
interface TransfererData extends StrategyData {
    type: Strategy.Transferer
    moveCache: MoveCacheData
}

/**
 * 运输者
 */
export const Transferer: IStrategy = {
    minEnergy: GetRequiredEnergy([CARRY, MOVE]),
    create(maxEnergy: number) {
        let rest = maxEnergy - this.minEnergy
        const body: BodyPartConstant[] = [CARRY, MOVE]
        if (rest >= BODYPART_COST.carry) {
            body.unshift(CARRY)
            rest -= BODYPART_COST.carry
        }
        const count = Math.min(1, Math.floor(rest / (BODYPART_COST.carry * 2 + BODYPART_COST.move)))
        for (let i = 0; i < count; i++) {
            body.push(CARRY, CARRY, MOVE)
        }
        return body
    },
    initStrategy(creep: Creep) {
        const strategy = creep.memory.strategy as TransfererData
        strategy.moveCache = initMoveCache(creep)
    },
    start(creep: Creep) {
        FindPickupTarget(creep)
    },
    callbackMap: {
        [Command.Pickup]: (creep: Creep, result: PickupResult): void => {
            const strategy = creep.memory.strategy as TransfererData
            switch (result) {
                case PickupResult.TargetLost:
                case PickupResult.TargetNeedReplace:
                    if (creep.store.energy === 0 || !FindTransferTarget(creep)) {
                        FindPickupTarget(creep)
                    }
                    break
                case PickupResult.Moving:
                    if (checkMoveFail(creep, strategy.moveCache)) {
                        FindPickupTarget(creep)
                    }
                    break
                case PickupResult.Full:
                    FindTransferTarget(creep)
                    break
            }
        },
        [Command.Transfer]: (creep: Creep, result: TransferResult): void => {
            const strategy = creep.memory.strategy as TransfererData
            switch (result) {
                case TransferResult.TargetLost:
                case TransferResult.TargetNeedReplace:
                    if (creep.store.energy === 0 || !FindTransferTarget(creep)) {
                        FindPickupTarget(creep)
                    }
                    break
                case TransferResult.Moving:
                    if (checkMoveFail(creep, strategy.moveCache)) {
                        FindTransferTarget(creep)
                    }
                    break
                case TransferResult.RequireMoreEnergy:
                    FindPickupTarget(creep)
                    break
            }
        },
    }
}

/**
 * 找到下一个捡起目标
 * @param creep creep
 */
function FindPickupTarget(creep: Creep): boolean {
    const target = RandomObjectInList(creep.room.find(FIND_DROPPED_RESOURCES))
    if (target) {
        SetNextCommand(Command.Pickup, creep, target)
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}

/**
 * 找到下一个转移目标
 * @param creep creep
 */
function FindTransferTarget(creep: Creep): boolean {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure => {
            switch (structure.structureType) {
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_TOWER:
                    return structure.my && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                case STRUCTURE_STORAGE:
                    return structure.my && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                case STRUCTURE_CONTAINER:
                    return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
            return false
        }),
        range: 1,
    }) as (StructureContainer | StructureExtension | StructureSpawn | StructureTower | StructureStorage | null)
    if (target) {
        SetNextCommand(Command.Transfer, creep, target)
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}