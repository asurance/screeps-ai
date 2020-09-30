import { SetNextCommand } from '../command/command'
import { IStrategy } from './strategy'
import { GetRequiredEnergy } from '../util'
import { GetRoomInfo } from '../roomInfo'

/**
 * 采集者策略
 */
export const Harvester: IStrategy = {
    minEnergy: GetRequiredEnergy([MOVE, WORK]),
    create(maxEnergy: number) {
        const count = Math.min(6, Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work))
        const body: BodyPartConstant[] = [MOVE, WORK]
        body.splice(0, 0, ...new Array<BodyPartConstant>(count).fill(WORK))
        return body
    },
    initStrategy() {
        // TODO
    },
    start(creep: Creep) {
        FindNextTarget(creep)
    },
    callbackMap: {},
}

/**
 * 找到下一个采集目标
 * @param creep creep
 * @return 是否成功
 */
function FindNextTarget(creep: Creep): boolean {
    const roomInfos = GetRoomInfo(creep.room)
    for (let i = 0; i < roomInfos.sourceInfo.length; i++) {
        if (roomInfos.creepInfo[i] === null) {
            const target = Game.getObjectById(roomInfos.sourceInfo[i])
            if (target) {
                SetNextCommand(Command.Harvest, creep, target)
                roomInfos.creepInfo[i] = creep.name
                return true
            }
        }
    }
    creep.say('闲置中')
    return false
}