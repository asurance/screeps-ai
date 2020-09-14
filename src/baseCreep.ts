export const EnergyMap: Readonly<{ [key in BodyPartConstant]: number }> = {
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

export interface CreepController<T extends CreepType = CreepType> {
    readonly type: T
    readonly minEnergy: number
    create(spawn: StructureSpawn, name: string, maxEnergy: number): ScreepsReturnCode
    ticker(creep: Creep<MemoryData<T>>): boolean
}