import { BaseCreep, BaseCreepCtor, GetRequiredEnergy } from './baseCreep'

interface Data extends MemoryData {
    type: CreepType.Carrier
    pickup: boolean
    targetId: Id<Resource> | Id<Structure> | null
}

export const Carrier: BaseCreepCtor<CreepType.Carrier> = class Carrier implements BaseCreep {

    private static id = 0

    static readonly type = CreepType.Carrier

    static readonly minEnergy = GetRequiredEnergy(['carry', 'move'])

    static serialize(): number {
        return this.id
    }

    static deserialize(data: number): void {
        this.id = data
    }

    creep!: Creep<Data>

    create(spawn: StructureSpawn): ScreepsReturnCode {
        const name = `${Carrier.type}-${Carrier.id}`
        const result = spawn.spawnCreep(['work', 'move'], `${Carrier.type}-${Carrier.id}`)
        if (result === OK) {
            Carrier.id++
            this.creep = Game.creeps[name] as Creep<Data>
            this.creep.memory = {
                type: CreepType.Carrier,
                pickup: true,
                targetId: null
            }
        }
        return result
    }

    ticker(): void {
        const memory = this.creep.memory
        if (memory.pickup) {
            if (this.creep.store.energy < this.creep.store.getCapacity('energy')) {
                if (memory.targetId === null) {
                    const target = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
                    if (target) {
                        memory.targetId = target.id
                    }
                }
                if (memory.targetId !== null) {
                    this.creep.say('寻找资源')
                    const target = Game.getObjectById(memory.targetId as Id<Resource>)!
                    if (this.creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(target)
                    }
                } else {
                    memory.pickup = false
                    memory.targetId = null
                }
            } else {
                memory.pickup = false
                memory.targetId = null
            }
        } else {
            if (this.creep.store.energy > 0) {
                if (memory.targetId === null) {
                    const target = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS)
                    if (target) {
                        memory.targetId = target.id
                    }
                }
                if (memory.targetId !== null) {
                    this.creep.say('放置资源')
                    const target = Game.getObjectById(memory.targetId as Id<Structure>)!
                    if (this.creep.transfer(target, 'energy') === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(target)
                    }
                } else {
                    memory.pickup = true
                    memory.targetId = null
                }
            } else {
                memory.pickup = true
                memory.targetId = null
            }
        }
    }
}