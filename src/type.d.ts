interface Creep<T extends MemoryData = MemoryData> {
    memory: T
}

interface MemoryData extends CreepMemory {
    type: CreepType
}

interface Game {
    killAllCreeps(): void
}

const enum CreepType {
    Harvester = 'harvester',
    Upgrader = 'upgrader',
    Builder = 'builder',
}