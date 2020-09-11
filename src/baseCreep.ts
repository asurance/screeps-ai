export interface BaseCreep {
    creep: Creep
    create(spawn: StructureSpawn, maxEnergy: number): ScreepsReturnCode
    ticker(): void
}

export interface BaseCreepCtor<T extends CreepType> {
    new(...argv: unknown[]): BaseCreep
    readonly type: T
    readonly minEnergy: number
    serialize(): CreepDataMap[T]
    deserialize(data: CreepDataMap[T]): void
}

export const EnergyMap: { [key in BodyPartConstant]: number } = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
}

export function GetRequiredEnergy(body: BodyPartConstant[]): number {
    return body.reduce((pre, cur) => {
        return pre + EnergyMap[cur]
    }, 0)
}