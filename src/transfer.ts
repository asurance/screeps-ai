import { RandomObjectInList } from './util'

interface Transferable extends CreepMemoryData {
    transferId?: Id<AnyStructure>
}

export function Transfer(creep: Creep<Transferable>): number {
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
            return -1
        } else {
            creep.say('运输中')
            return -1
        }
    } else {
        creep.say('闲置中')
        return 10
    }
}