interface Creep<T extends MemoryData = MemoryData> {
    memory: T
}

interface MemoryData<T extends Creeptype = CreepType> extends CreepMemory {
    type: T
}

interface Game {
    killAllCreeps(): void
}

const enum CreepType {
    Harvester = 'harvester',
    Upgrader = 'upgrader',
    Builder = 'builder',
}