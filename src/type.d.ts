interface Memory {
    harvester?: number
    transfer?: number
    upgrader?: number
    builder?: number
    repairer?: number
}

interface Creep<T extends MemoryData = MemoryData> {
    memory: T
}

interface MemoryData<T extends Creeptype = CreepType> extends CreepMemory {
    type: T
}

const enum CreepType {
    Harvester = 'harvester',
    Transfer = 'transfer',
    Upgrader = 'upgrader',
    Builder = 'builder',
    Repairer = 'repairer',
}