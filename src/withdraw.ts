import { RandomObjectInList } from './util'

interface Withdrawable extends CreepMemoryData {
    withdrawId?: Id<Tombstone | Ruin | Structure>
}

export function Withdraw(creep: Creep<Withdrawable>): number {
    let target: Tombstone | Ruin | Structure | null = null
    if (creep.memory.withdrawId) {
        target = Game.getObjectById(creep.memory.withdrawId)
        if (target && (target as Ruin | Tombstone | StructureContainer | StructureExtension).store.energy === 0) {
            target = null
        }
    }
    if (target === null) {
        const source = creep.room.find(FIND_RUINS, {
            filter: (ruin) => ruin.store.energy > 0
        })
        target = RandomObjectInList(source)
        if (target === null) {
            const source = creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => tombstone.store.energy > 0
            })
            target = RandomObjectInList(source)
        }
        if (target === null) {
            const source = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER
                    || (structure.structureType === STRUCTURE_EXTENSION && structure.my))
                    && structure.store.energy > 0
            })
            target = RandomObjectInList(source)
        }
        if (target) {
            creep.memory.withdrawId = target.id
        }
    }
    if (target) {
        if (creep.withdraw(target, 'energy') === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
            return 0
        } else {
            creep.say('提取中')
            return -2
        }
    } else {
        return 10
    }
}