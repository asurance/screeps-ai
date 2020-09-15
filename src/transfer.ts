import { RandomObjectInList } from './util'

interface Transferable extends MemoryData {
    transferId?: Id<AnyStructure>
}

export function Transfer(creep: Creep<Transferable>): boolean {
    let target: AnyStructure | null = null
    if (creep.memory.transferId) {
        target = Game.getObjectById(creep.memory.transferId)
        if (target && (target as StructureSpawn | StructureTower | StructureExtension).store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            target = null
        }
    }
    if (target === null) {
        const source = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER
                    || (structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_TOWER
                        || structure.structureType === STRUCTURE_EXTENSION
                        && structure.my))
                    && (structure as StructureSpawn | StructureTower | StructureExtension).store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        })
        target = RandomObjectInList(source)
        if (target) {
            creep.memory.transferId = target.id
        }
    }
    if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }
        creep.say('运输中')
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}