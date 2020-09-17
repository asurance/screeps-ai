interface Memory {
    harvester?: number
    transfer?: number
    upgrader?: number
    builder?: number
    repairer?: number
}

interface Creep<T extends CreepMemoryData = CreepMemoryData> {
    memory: T
}

interface CreepMemoryData<T extends Creeptype = CreepType> extends CreepMemory {
    type: T
}

const enum CreepType {
    Harvester = 'harvester',
    Transfer = 'transfer',
    Upgrader = 'upgrader',
    Builder = 'builder',
    Repairer = 'repairer',
}