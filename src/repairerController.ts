import { CreepController, GetRequiredEnergy } from './creepController'
import { RandomInt } from './util'
import { Repair } from './repair'
import { Withdraw } from './withdraw'

interface Data {
    type: CreepType.Repairer
    repairing?: boolean
    withdrawId?: Id<Tombstone | Ruin | Structure>
    repairId?: Id<Structure>
    repairTick?: number
}

export const RepairController: CreepController<CreepType.Repairer> = {

    type: CreepType.Repairer,

    minEnergy: GetRequiredEnergy(['work', 'carry', 'move']),

    create(spawn: StructureSpawn, name: string, maxEnergy: number) {
        const body = ['work', 'carry', 'move'] as BodyPartConstant[]
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.carry)
        if (maxCount > 0) {
            const count = RandomInt(maxCount + 1)
            if (count > 0) {
                body.splice(1, 0, ...new Array<BodyPartConstant>(count).fill('carry'))
            }
        }
        return spawn.spawnCreep(body, name)
    },

    ticker(creep: Creep) {
        const memory = creep.memory as Data
        let repairing = memory.repairing ?? false
        if (repairing) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                repairing = false
                delete memory.repairId
                delete memory.repairTick
            } else {
                const tick = (memory.repairTick ?? 300) - 1
                if (tick <= 0) {
                    delete memory.repairId
                    delete memory.repairTick
                } else {
                    memory.repairTick = tick
                }
            }
        } else {
            if (creep.store.getFreeCapacity() === 0) {
                repairing = true
                delete memory.withdrawId
            }
        }
        if (repairing) {
            memory.repairing = true
        } else {
            delete memory.repairing
        }
        if (repairing) {
            return Repair(creep)
        }
        else {
            return Withdraw(creep)
        }
    },
} 