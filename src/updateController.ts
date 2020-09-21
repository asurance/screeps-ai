import { config } from './config'

/**
 * 升级控制器的结果
 */
export const enum UpdateControllerResult {
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
}

/**
 * 升级控制器前
 * @param creep Creep
 */
export function SetCreepUpdateController(): void {
    // TODO 暂时没有需要做的
}

export function UpdateController(creep: Creep): UpdateControllerResult {
    if (creep.store.energy > 0) {
        if (creep.pos.inRangeTo(creep.room.controller!, 3)) {
            const result = creep.upgradeController(creep.room.controller!)
            if (result !== OK) {
                Game.notify(`upgradeController fail with code:${result}`, config.notifyInterval)
            }
            return UpdateControllerResult.OK
        } else {
            const result = creep.moveTo(creep.room.controller!, { range: 3 })
            if (result !== OK) {
                Game.notify(`move fail with code:${result}`, config.notifyInterval)
            }
            return UpdateControllerResult.Moving
        }
    } else {
        return UpdateControllerResult.RequireMoreEnergy
    }
}