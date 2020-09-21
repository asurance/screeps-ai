import { SetNextCommand } from './command'
import { HarvestResult } from './harvest'
import { MoveResult } from './move'
import { IStrategy } from './strategy'
import { GetRequiredEnergy, GetRoomInfo, RandomObjectInList } from './util'

/**
 * 采集者数据
 */
interface HarvesterData extends StrategyData {
    type: Strategy.Harvester
    targetId: Id<Source>
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
    start(creep: Creep) {
        FindNextTargetAndMove(creep)
    },
    callbackMap: {
        [Command.Move]: (creep: Creep, result: MoveResult): void => {
            const strategy = creep.memory.strategy as HarvesterData
            const target = Game.getObjectById(strategy.targetId)!
            switch (result) {
                case MoveResult.InRange:
                    SetNextCommand(Command.Harvest, creep, target)
                    break
                case MoveResult.TargetLost:
                case MoveResult.TargetNeedReplace:
                    FindNextTargetAndMove(creep)
                    break
            }
        },
        [Command.Harvest]: (creep: Creep, result: HarvestResult): void => {
            if (result !== HarvestResult.OK) {
                FindNextTargetAndMove(creep)
            }
        }
    },
}

/**
 * 找到下一个采集目标
 * @param creep creep
 */
function FindNextTargetAndMove(creep: Creep) {
    const roomInfos = GetRoomInfo(creep.room)
    const sourceId = RandomObjectInList(roomInfos.sourceInfo)
    if (sourceId) {
        const target = Game.getObjectById(sourceId)
        if (target) {
            SetNextCommand(Command.Move, creep, target, 1)
        }
    }
}