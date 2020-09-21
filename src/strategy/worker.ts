import { SetNextCommand } from '../command/command'
import { checkMoveFail, initMoveCache, MoveCacheData } from '../moveCache'
import { IStrategy } from './strategy'
import { GetRequiredEnergy, GetRoomInfo, RandomObjectInList } from '../util'

/**
 * 采集者数据
 */
interface WorkerData extends StrategyData {
    type: Strategy.Worker
    moveCache: MoveCacheData
}

/**
 * 采集者策略
 */
export const Worker: IStrategy = {
    minEnergy: GetRequiredEnergy([MOVE, WORK]),
    create(maxEnergy: number) {
        const count = Math.min(4, Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work))
        const body: BodyPartConstant[] = [MOVE, WORK]
        body.splice(0, 0, ...new Array<BodyPartConstant>(count).fill(WORK))
        return body
    },
    initStrategy(creep: Creep) {
        const strategy = creep.memory.strategy as WorkerData
        strategy.moveCache = initMoveCache(creep)
    },
    start(creep: Creep) {
        // TODO 
    },
    callbackMap: {
    },
}