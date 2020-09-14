interface Creep<T extends MemoryData = MemoryData> {
    memory: T
}

interface MemoryData extends CreepMemory {
    type: CreepType
}

const enum CreepType {
    Worker = 'worker',
    Carrier = 'carrier',
    Walker = 'walker',
    Harvester = 'harvester',
    Upgrader = 'upgrader',
    Builder = 'builder',
}