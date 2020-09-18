interface Memory {
    harvester?: number
    transfer?: number
    upgrader?: number
    builder?: number
    repairer?: number
}

interface CreepMemory {
    type: CreepType
    cmd?: Command
}

const enum CreepType {
    Harvester = 'harvester',
    Transfer = 'transfer',
    Upgrader = 'upgrader',
    Builder = 'builder',
    Repairer = 'repairer',
}

const enum Command {
    Harvest = 'harvest'
}