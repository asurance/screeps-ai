interface Memory {
    ctors: { [key in CreepType]: CreepDataMap[key] }
}

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
}

interface CreepDataMap {
    [CreepType.Worker]: number
    [CreepType.Carrier]: number
    [CreepType.Walker]: number
}