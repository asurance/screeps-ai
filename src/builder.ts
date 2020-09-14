import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Builder
    building: boolean
    targetId: Id<Source> | null
    buildId: Id<ConstructionSite<BuildableStructureConstant>> | null
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
                building: false,
                targetId: null,
                buildId: null,
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

            let target: ConstructionSite<BuildableStructureConstant> | null = null
            if (this.creep.memory.buildId) {
                target = Game.getObjectById(this.creep.memory.buildId)
            }
            if (target === null) {
                const source = this.creep.room.find(FIND_CONSTRUCTION_SITES)
                if (source.length > 0) {
                    target = source[Math.floor(Math.random() * source.length)]
                    this.creep.memory.buildId = target.id
                }
            }
            if (target) {
                if (this.creep.build(target) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target)
                }
                this.creep.say('建造中')
                return true
            } else {
                this.creep.say('闲置中')
                return false
            }
        }
        else {
            let target: Source | null = null
            if (this.creep.memory.targetId) {
                target = Game.getObjectById(this.creep.memory.targetId)
            }
            if (target === null) {
                const source = this.creep.room.find(FIND_SOURCES)
                if (source.length > 0) {
                    target = source[Math.floor(Math.random() * source.length)]
                    this.creep.memory.targetId = target.id
                }
            }
            if (target) {
                if (this.creep.harvest(target) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target)
                }
                this.creep.say('采矿中')
                return true
            } else {
                this.creep.say('闲置中')
                return false
            }
        }
    }

}