interface Buildable {
    buildId?: Id<ConstructionSite>
}

export function Build(creep: Creep): number {
    const memory = creep.memory as Buildable
    let target: ConstructionSite<BuildableStructureConstant> | null = null
    if (memory.buildId) {
        target = Game.getObjectById(memory.buildId)
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
            memory.buildId = target.id
        }
    }
    if (target) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
            return 0
        } else {
            creep.say('建造中')
            return -2
        }
    } else {
        creep.say('闲置中')
        return 10
    }
}