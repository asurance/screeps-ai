import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Upgrader
    upgrading: boolean
    targetId: Id<Source> | null
}

export const Upgrader: BaseCreepCtor<CreepType.Upgrader> = class Upgrader implements BaseCreep {

    static readonly type = CreepType.Upgrader

    static readonly minEnergy = GetRequiredEnergy(['work', 'carry', 'move'])

    creep!: Creep<Data>

    create(spawn: StructureSpawn): ScreepsReturnCode {
        const name = `${Upgrader.type}-${Game.time}`
        const result = spawn.spawnCreep(['work', 'carry', 'move'], name)
        if (result === OK) {
            this.creep = Game.creeps[name] as Creep<Data>
            this.creep.memory = {
                type: CreepType.Upgrader,
                upgrading: false,
                targetId: null,
            }
        }
        return result
    }

    ticker(): boolean {
        if (this.creep.memory.upgrading) {
            if (this.creep.store[RESOURCE_ENERGY] === 0) {
                this.creep.memory.upgrading = false
            }
        } else {
            if (this.creep.store.getFreeCapacity() === 0) {
                this.creep.memory.upgrading = true
            }
        }
        if (this.creep.memory.upgrading) {
            if (this.creep.upgradeController(this.creep.room.controller!) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller!)
            }
            this.creep.say('升级中')
            return true
        } else {
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