interface Buildable extends MemoryData {
    buildId?: Id<ConstructionSite>
}

export function Build(creep: Creep<Buildable>): boolean {
    let target: ConstructionSite<BuildableStructureConstant> | null = null
    if (creep.memory.buildId) {
        target = Game.getObjectById(creep.memory.buildId)
    }
    if (target === null) {
        const source = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
        if (source.length > 0) {
            target = source.reduce((pre, cur) => {
                if ((pre.progress + 1) / pre.progressTotal < (cur.progress + 1) / cur.progressTotal) {
                    return cur
                } else {
                    return pre
                }
            })
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