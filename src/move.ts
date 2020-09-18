/**
 * 移动使用的数据
 */
interface MoveData extends CommandData {
    /**
     * 移动
     */
    type: Command.Move
    /**
     * 移动到的目标
     */
    target: Id<RoomObject>
    /**
     * 移动需要达到的
     */
    range: number
}

/**
 * 移动结果
 */
export const enum MoveResult {
    /**
     * 移动到范围内
     */
    InRange,
    /**
     * 未移动到范围内
     */
    NotInRange,
    /**
     * 目标消失了
     */
    TargetLost,
    /**
     * 目标需要更换
     */
    TargetNeedReplace,
}

/**
 * 移动前
 * @param creep Creep
 * @param target 目标
 * @param range 需要移动到多近
 */
export function SetCreepMove(creep: Creep, target: RoomObject & { id: Id<RoomObject> }, range: number): void {
    const command = creep.memory.cmd as MoveData
    command.target = target.id
    command.range = range
}

/**
 * 移动
 * @param creep Creep
 * @return 移动结果
 */
export function Move(creep: Creep): MoveResult {
    const command = creep.memory.cmd as MoveData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (target.room === creep.room && creep.pos.inRangeTo(target.pos, command.range)) {
            return MoveResult.InRange
        } else {
            const result = creep.moveTo(target, { range: command.range })
            if (result !== OK) {
                Game.notify(`move fail with code:${result}`, 1440)
            }
            return MoveResult.NotInRange
        }
    }
    return MoveResult.TargetLost
}