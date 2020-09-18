interface Repairable {
    repairId?: Id<Structure>
}

export function Repair(creep: Creep): number {
    let target: Structure | null = null
    const memory = creep.memory as Repairable
    if (memory.repairId) {
        target = Game.getObjectById(memory.repairId)
        if (target && (target.hits === target.hitsMax)) {
            target = null
        }
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
            memory.repairId = target.id
        }
    }
    if (target) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
            return 0
        } else {
            creep.say('维修中')
            return -2
        }
    } else {
        creep.say('闲置中')
        return 10
    }
}