import { SetCreepHarvest } from './harvest'
import { SetCreepMove as SetCreepMove, MoveResult } from './move'
import { IStrategy } from './strategy'
import { GetRequiredEnergy } from './util'

interface HarvesterData extends StrategyData {
    type: Strategy.Harvester
    targetId: Id<Source>
}

export const Harvester: IStrategy = {
    minEnergy: GetRequiredEnergy([MOVE, WORK]),
    create(maxEnergy: number) {
        const count = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work)
        const body: BodyPartConstant[] = [MOVE, WORK]
        body.splice(0, 0, ...new Array<BodyPartConstant>(count).fill(WORK))
        return body
    },
    start(creep: Creep) {
        const target = creep.room.find(FIND_SOURCES)[0]
        SetCreepMove(creep, target, 1)
    },
    callbackMap: {
        [Command.Move]: (creep: Creep, result: MoveResult): void => {
            const strategy = creep.memory.strategy as HarvesterData
            const target = Game.getObjectById(strategy.targetId)!
            switch (result) {
                case MoveResult.InRange:
                    SetCreepHarvest(creep, target)
                    break
            }
        },
        [Command.Harvest]: (): void => {
            // TODO
        }
    },
}