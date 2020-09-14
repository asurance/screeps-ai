import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Upgrader
    upgrading: boolean
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
            }
        }
        return result
    }

    ticker(): boolean {
        if (this.creep.memory.upgrading && this.creep.store[RESOURCE_ENERGY] === 0) {
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
        } else {
            const sources = this.creep.room.find(FIND_SOURCES)
            if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0])
            }
            this.creep.say('采矿中')
        }
        return true
    }

}