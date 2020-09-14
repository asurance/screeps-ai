import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Harvester
    targetId: Id<Source> | null
}

export const Harvester: BaseCreepCtor<CreepType.Harvester> = class Harvester implements BaseCreep {

    static readonly type = CreepType.Harvester

    static readonly minEnergy = GetRequiredEnergy(['work', 'carry', 'move'])

    creep!: Creep<Data>

    create(spawn: StructureSpawn): ScreepsReturnCode {
        const name = `${spawn.name}-${Game.time}`
        const result = spawn.spawnCreep(['work', 'carry', 'move'], name)
        if (result === OK) {
            this.creep = Game.creeps[name] as Creep<Data>
            this.creep.memory = {
                type: CreepType.Harvester,
                targetId: null,
            }
        }
        return result

    }

    ticker(): boolean {
        if (this.creep.store.getFreeCapacity() > 0) {
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
        } else {
            const targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION
                        || structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_TOWER
                        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            })
            if (targets.length > 0) {
                if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(targets[0])
                }
                this.creep.say('运输中')
                return true
            } else {
                this.creep.say('闲置中')
                return false
            }
        }
    }

}