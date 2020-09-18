import { RandomObjectInList } from './util'

interface Harvestable {
    harvestId?: Id<Source>
    harvestTicker?: number
}
export function Harvest(creep: Creep): number {
    let target: Source | null = null
    const memory = creep.memory as Harvestable
    if (memory.harvestId) {
        target = Game.getObjectById(memory.harvestId)
    }
    let needRefresh = false
    if (target) {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            let ticker = memory.harvestTicker ?? 180
            ticker--
            if (ticker <= 0) {
                needRefresh = true
                delete memory.harvestTicker
            } else {
                memory.harvestTicker = ticker
            }
        }
    }
    if (target === null || needRefresh) {
        const source = creep.room.find(FIND_SOURCES)
        if (needRefresh) {
            const index = source.indexOf(target!)
            if (index >= 0) {
                source.splice(index, 1)
            }
        }
        target = RandomObjectInList(source)
        if (target) {
            memory.harvestId = target.id
        }
    }
    if (target) {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
            return 2
        } else {
            creep.say('收获中')
            return -2
        }
    } else {
        creep.say('闲置中')
        return 10
    }
}