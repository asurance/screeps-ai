interface Memory {
    hasWalker: boolean
}
interface CreepMemory {
    type: CreepType | string
    direction: DirectionConstant
}

const enum CreepType {
    Walker = 'Walker'
}

interface ICreep {
    count: number
    readonly type: CreepType
    create(spawn: StructureSpawn, room: Room): ScreepsReturnCode
    tick(creep: Creep, room: Room): void
}