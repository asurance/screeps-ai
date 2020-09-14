import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Worker
    targetId: Id<Source> | null
}

export const Worker: BaseCreepCtor<CreepType.Worker> = class Worker implements BaseCreep {

    static readonly type = CreepType.Worker

    static readonly minEnergy = GetRequiredEnergy(['work', 'move'])

    creep!: Creep<Data>

    create(spawn: StructureSpawn): ScreepsReturnCode {
        const name = `${Worker.type}-${Game.time}`
        const result = spawn.spawnCreep(['work', 'move'], name)
        if (result === OK) {
            this.creep = Game.creeps[name] as Creep<Data>
            this.creep.memory = {
                type: CreepType.Worker,
                targetId: null,
            }
        }
        return result
    }

    ticker(): boolean {
        const memory = this.creep.memory
        if (memory.targetId === null) {
            const target = this.creep.pos.findClosestByPath(FIND_SOURCES)
            if (target) {
                memory.targetId = target.id
            }
        }
        if (memory.targetId !== null) {
            this.creep.say('采矿中')
            const target = Game.getObjectById(memory.targetId)!
            if (this.creep.harvest(target) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target)
            }
        }
        return true
    }
} 