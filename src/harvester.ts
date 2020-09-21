import { SetNextCommand } from './command'
import { HarvestResult } from './harvest'
import { checkMoveFail, initMoveCache, MoveCacheData } from './moveCache'
import { IStrategy } from './strategy'
import { GetRequiredEnergy, GetRoomInfo, RandomObjectInList } from './util'

/**
 * 采集者数据
 */
interface HarvesterData extends StrategyData {
    type: Strategy.Harvester
    moveCache: MoveCacheData
}

/**
 * 采集者策略
 */
export const Harvester: IStrategy = {
    minEnergy: GetRequiredEnergy([MOVE, WORK]),
    create(maxEnergy: number) {
        const count = Math.min(4, Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work))
        const body: BodyPartConstant[] = [MOVE, WORK]
        body.splice(0, 0, ...new Array<BodyPartConstant>(count).fill(WORK))
        return body
    },
    initStrategy(creep: Creep) {
        const strategy = creep.memory.strategy as HarvesterData
        strategy.moveCache = initMoveCache(creep)
    },
    start(creep: Creep) {
        FindNextTarget(creep)
    },
    callbackMap: {
        [Command.Harvest]: (creep: Creep, result: HarvestResult): void => {
            const strategy = creep.memory.strategy as HarvesterData
            switch (result) {
                case HarvestResult.TargetLost:
                case HarvestResult.TargetNeedReplace:
                    FindNextTarget(creep)
                    break
                case HarvestResult.Moving:
                    if (checkMoveFail(creep, strategy.moveCache)) {
                        FindNextTarget(creep)
                    }
                    break
            }
        }
    },
}

/**
 * 找到下一个采集目标
 * @param creep creep
 * @return 是否成功
 */
function FindNextTarget(creep: Creep): boolean {
    const roomInfos = GetRoomInfo(creep.room)
    const sourceId = RandomObjectInList(roomInfos.sourceInfo)
    if (sourceId) {
        const target = Game.getObjectById(sourceId)
        if (target) {
            SetNextCommand(Command.Harvest, creep, target)
            return true
        }
    }
    creep.say('闲置中')
    return false
}