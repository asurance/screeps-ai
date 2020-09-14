import { RandomObjectInList } from './util'

interface Buildable extends MemoryData {
    buildId?: Id<ConstructionSite>
}

export function Build(creep: Creep<Buildable>): boolean {
    let target: ConstructionSite<BuildableStructureConstant> | null = null
    if (creep.memory.buildId) {
        target = Game.getObjectById(creep.memory.buildId)
    }
    if (target === null) {
        const source = creep.room.find(FIND_CONSTRUCTION_SITES)
        target = RandomObjectInList(source)
        if (target) {
            creep.memory.buildId = target.id
        }
    }
    if (target) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }
        creep.say('建造中')
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}