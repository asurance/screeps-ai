export function GetRequiredEnergy(body: BodyPartConstant[]): number {
    return body.reduce((pre, cur) => {
        return pre + BODYPART_COST[cur]
    }, 0)
}

export interface CreepController<T extends CreepType = CreepType> {
    readonly type: T
    readonly minEnergy: number
    create(spawn: StructureSpawn, name: string, maxEnergy: number): ScreepsReturnCode
    ticker(creep: Creep<MemoryData<T>>): boolean
}