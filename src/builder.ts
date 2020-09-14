import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Builder
    building: boolean
}

export const Builder: BaseCreepCtor<CreepType.Builder> = class Builder implements BaseCreep {

    static readonly type = CreepType.Builder

    static readonly minEnergy = GetRequiredEnergy(['work', 'carry', 'move'])

    creep!: Creep<Data>

    create(spawn: StructureSpawn): ScreepsReturnCode {
        const name = `${Builder.type}-${Game.time}`
        const result = spawn.spawnCreep(['work', 'carry', 'move'], name)
        if (result === OK) {
            this.creep = Game.creeps[name] as Creep<Data>
            this.creep.memory = {
                type: CreepType.Builder,
                building: false
            }
        }
        return result
    }

    ticker(): boolean {
        const creep = this.creep
        if (creep.memory.building) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.building = false
            }
        } else {
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.building = true
            }
        }

        if (creep.memory.building) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0])
                }
                creep.say('建造中')
                return true
            } else {
                return false
            }
        }
        else {
            const sources = creep.room.find(FIND_SOURCES)
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0])
            }
            creep.say('采矿中')
            return true
        }
    }

}