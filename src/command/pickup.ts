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

export function Pickup(creep: Creep): PickupResult {
    const command = creep.memory.cmd as PickupData
    const target = Game.getObjectById(command.target)
    if (target) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (target.amount > 0) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.pickup(target)
                    if (result !== OK) {
                        Game.notify(`pickup fail with code:${result}`, config.notifyInterval)
                    }
                    return PickupResult.OK
                } else {
                    const result = creep.moveTo(creep.room.controller!, { range: 1 })
                    if (result !== OK) {
                        Game.notify(`move fail with code:${result}`, config.notifyInterval)
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