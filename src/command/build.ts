import { config } from '../config'

/**
 * 建造数据
 */
interface BuildData extends CommandData {
    /**
     * 建造
     */
    type: Command.Build
    /**
     * 建造的目标
     */
    target: Id<ConstructionSite>
}

/**
 * 建造的结果
 */
export const enum BuildResult {
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
 * 建造前
 * @param creep Creep
 * @param target 目标
 */
export function SetCreepBuild(creep: Creep, target: ConstructionSite): void {
    const command = creep.memory.cmd as BuildData
    command.target = target.id
}

/**
 * 建造
 * @param creep Creep
 */
export function Build(creep: Creep): BuildResult {
    const command = creep.memory.cmd as BuildData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (creep.store.energy > 0) {
            if (target.progress < target.progressTotal) {
                if (creep.pos.inRangeTo(target, 3)) {
                    creep.build(target)
                    return BuildResult.OK
                } else {
                    if (creep.fatigue <= 0) {
                        creep.moveTo(target, { range: 3 })
                    }
                    return BuildResult.Moving
                }
            } else {
                return BuildResult.TargetNeedReplace
            }
        } else {
            return BuildResult.RequireMoreEnergy
        }
    } else {
        return BuildResult.TargetLost
    }
}