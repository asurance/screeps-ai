import { config } from '../config'

/**
 * 取回数据
 */
interface WithdrawData extends CommandData {
    /**
     * 取回
     */
    type: Command.Withdraw
    /**
     * 取回的目标
     */
    target: Id<StructureContainer | StructureStorage | Ruin | Tombstone>
}

/**
 * 取回的结果
 */
export const enum WithdrawResult {
    /**
     * 成功
     */
    OK,
    /**
     * 移动中
     */
    Moving,
    /**
     * 储量满了
     */
    Full,
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
 * 取回前
 * @param creep Creep
 * @param target 目标
 */
export function SetCreepWithdraw(creep: Creep, target: StructureContainer | StructureStorage | Ruin | Tombstone): void {
    const command = creep.memory.cmd as WithdrawData
    command.target = target.id
}

/**
 * 取回
 * @param creep Creep
 */
export function Withdraw(creep: Creep): WithdrawResult {
    const command = creep.memory.cmd as WithdrawData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (target.store.energy > 0) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.withdraw(target, RESOURCE_ENERGY)
                    if (result !== OK) {
                        Game.notify(`withdraw fail with code:${result}`, config.notifyInterval)
                    }
                    return WithdrawResult.OK
                } else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 1 })
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, config.notifyInterval)
                        }
                    }
                    return WithdrawResult.Moving
                }
            } else {
                return WithdrawResult.TargetNeedReplace
            }
        } else {
            return WithdrawResult.Full
        }
    } else {
        return WithdrawResult.TargetLost
    }
}