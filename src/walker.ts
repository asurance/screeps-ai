import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Walker
    direction: DirectionConstant
    restTick: number
}

export const Walker: BaseCreepCtor<CreepType.Walker> = class Walker implements BaseCreep {

    static readonly type = CreepType.Walker

    static readonly minEnergy = GetRequiredEnergy(['move'])

    creep!: Creep<Data>

    create(spawn: StructureSpawn): ScreepsReturnCode {
        const name = `${Walker.type}-${Game.time}`
        const result = spawn.spawnCreep(['move'], `${Walker.type}-${Game.time}`)
        if (result === OK) {
            this.creep = Game.creeps[name] as Creep<Data>
            this.creep.memory = {
                type: CreepType.Walker,
                direction: 1 + Math.floor(Math.random() * 8) as DirectionConstant,
                restTick: 60,
            }
        }
        return result
    }

    ticker(): boolean {
        const memory = this.creep.memory
        memory.restTick--
        if (memory.restTick < 0) {
            memory.restTick = 60
            memory.direction = 1 + Math.floor(Math.random() * 8) as DirectionConstant
        }
        this.creep.move(memory.direction)
        return true
    }

}