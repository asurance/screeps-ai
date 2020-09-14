interface Buildable extends MemoryData {
    repairId?: Id<Structure>
}

export function Repair(creep: Creep<Buildable>): boolean {
    let target: Structure | null = null
    if (creep.memory.repairId) {
        target = Game.getObjectById(creep.memory.repairId)
    }
    if (target === null) {
        const source = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax
            }
        })
        if (source.length > 0) {
            target = source.reduce((pre, cur) => {
                if (pre.hits < cur.hits) {
                    return pre
                } else {
                    return cur
                }
            })
            creep.memory.repairId = target.id
        }
    }
    if (target) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }
        creep.say('维修中')
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}