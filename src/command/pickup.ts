import { config } from '../config'

/**
 * 捡起数据
 */
interface PickupData extends CommandData {
    /**
     * 捡起
     */
    type: Command.Pickup
    /**
     * 捡起的目标
     */
    target: Id<Resource>
}

/**
 * 捡起的结果
 */
export const enum PickupResult {
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

export function SetCreepPickup(creep: Creep, target: Resource): void {
    const command = creep.memory.cmd as PickupData
    command.target = target.id
}

/**
 * 捡起
 * @param creep Creep
 */
export function Pickup(creep: Creep): PickupResult {
    const command = creep.memory.cmd as PickupData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (target.amount > 0) {
                if (creep.pos.inRangeTo(target, 1)) {
                    creep.pickup(target)
                    return PickupResult.OK
                } else {
                    if (creep.fatigue <= 0) {
                        creep.moveTo(target, { range: 1 })
                    }
                    return PickupResult.Moving
                }
            } else {
                return PickupResult.TargetNeedReplace
            }
        } else {
            return PickupResult.Full
        }
    } else {
        return PickupResult.TargetLost
    }
}