import { config } from '../config'

/**
 * 维修数据
 */
interface RepairData extends CommandData {
    /**
     * 维修
     */
    type: Command.Repair
    /**
     * 维修的目标
     */
    target: Id<Structure>
}

/**
 * 维修的结果
 */
export const enum RepairResult {
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
 * 维修前
 * @param creep Creep
 * @param target 目标
 */
export function SetCreepRepair(creep: Creep, target: Structure): void {
    const command = creep.memory.cmd as RepairData
    command.target = target.id
}

/**
 * 维修
 * @param creep Creep
 */
export function Repair(creep: Creep): RepairResult {
    const command = creep.memory.cmd as RepairData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (creep.store.energy > 0) {
            if (target.hits < target.hitsMax) {
                if (creep.pos.inRangeTo(target, 3)) {
                    const result = creep.repair(target)
                    if (result !== OK) {
                        Game.notify(`withdraw fail with code:${result}`, config.notifyInterval)
                    }
                    return RepairResult.OK
                } else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 3 })
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, config.notifyInterval)
                        }
                    }
                    return RepairResult.Moving
                }
            } else {
                return RepairResult.TargetNeedReplace
            }
        } else {
            return RepairResult.RequireMoreEnergy
        }
    } else {
        return RepairResult.TargetLost
    }
}