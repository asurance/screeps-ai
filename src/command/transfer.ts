import { config } from '../config'

/**
 * 转移数据
 */
interface TransferData extends CommandData {
    /**
     * 转移
     */
    type: Command.Transfer
    /**
     * 转移的目标
     */
    target: Id<StructureContainer | StructureExtension | StructureSpawn | StructureTower | StructureStorage>
}

/**
 * 转移结果
 */
export const enum TransferResult {
    /**
     * 成功
     */
    OK,
    /**
     * 移动中
     */
    Moving,
    /**
     * 需要更多能量
     */
    RequireMoreEnergy,
    /**
     * 目标丢失
     */
    TargetLost,
    /**
     * 目标需要替换
     */
    TargetNeedReplace,
}

/**
 * 转移前
 * @param creep Creep
 * @param target 转移目标
 */
export function SetCreepTransfer(creep: Creep, target: StructureContainer | StructureSpawn | StructureExtension | StructureTower | StructureStorage): void {
    const command = creep.memory.cmd as TransferData
    command.target = target.id
}

/**
 * 转移
 * @param creep Creep
 */
export function Transfer(creep: Creep): TransferResult {
    const command = creep.memory.cmd as TransferData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (creep.store.energy > 0) {
            let hasRest = false
            switch (target.structureType) {
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_TOWER:
                    hasRest = target.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    break
                case STRUCTURE_CONTAINER:
                case STRUCTURE_STORAGE:
                    hasRest = target.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    break
            }
            if (hasRest) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.transfer(target, RESOURCE_ENERGY)
                    if (result !== OK) {
                        Game.notify(`transfer fail with code:${result}`, config.notifyInterval)
                    }
                    return TransferResult.OK
                } else {
                    const result = creep.moveTo(target, { range: 1 })
                    if (result !== OK) {
                        Game.notify(`move fail with code:${result}`, config.notifyInterval)
                    }
                    return TransferResult.Moving
                }
            } else {
                return TransferResult.TargetNeedReplace
            }
        } else {
            return TransferResult.RequireMoreEnergy
        }
    } else {
        return TransferResult.TargetLost
    }
}