import { RandomObjectInList } from './util'

interface Harvestable extends MemoryData {
    harvestId?: Id<Source>
}
export function Harvest(creep: Creep<Harvestable>): boolean {
    let target: Source | null = null
    if (creep.memory.harvestId) {
        target = Game.getObjectById(creep.memory.harvestId)
    }
    if (target === null) {
        const source = creep.room.find(FIND_SOURCES)
        target = RandomObjectInList(source)
        if (target) {
            creep.memory.harvestId = target.id
        }
    }
    if (target) {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }
        creep.say('采集中')
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}