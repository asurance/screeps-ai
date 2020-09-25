import { config } from '../config'

/**
 * 收获数据
 */
interface HarvestData extends CommandData {
    /**
     * 收获
     */
    type: Command.Harvest
    /**
     * 收获的目标
     */
    target: Id<Source>
}

/**
 * 收获的结果
 */
export const enum HarvestResult {
    /**
     * 成功
     */
    OK,
    /**
     * 移动中
     */
    Moving,
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
 * 收获前
 * @param creep Creep
 * @param target 目标
 */
export function SetCreepHarvest(creep: Creep, target: Source): void {
    const command = creep.memory.cmd as HarvestData
    command.target = target.id
}

/**
 * 收获
 * @param creep Creep
 * @return 收获结果
 */
export function Harvest(creep: Creep): HarvestResult {
    const command = creep.memory.cmd as HarvestData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (target.energy > 0 || target.ticksToRegeneration < 100) {
            if (creep.pos.inRangeTo(target.pos, 1)) {
                if (target.energy > 0) {
                    const result = creep.harvest(target)
                    if (result !== OK) {
                        Game.notify(`harvest fail with code:${result}`, config.notifyInterval)
                    }
                }
                return HarvestResult.OK
            } else {
                if (creep.fatigue <= 0) {
                    const result = creep.moveTo(target, { range: 1 })
                    if (result !== OK) {
                        Game.notify(`move fail with code:${result}`, config.notifyInterval)
                    }
                }
                return HarvestResult.Moving
            }
        } else {
            return HarvestResult.TargetNeedReplace
        }
    } else {
        return HarvestResult.TargetLost
    }
}