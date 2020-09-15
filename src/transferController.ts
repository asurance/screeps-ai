import { CreepController, GetRequiredEnergy } from './creepController'
import { Transfer } from './transfer'
import { Pickup } from './pickup'
import { RandomInt } from './util'

interface Data extends MemoryData {
    type: CreepType.Transfer
    transfering?: boolean
    pickupId?: Id<Resource>
    transferId?: Id<AnyStructure>
}

export const TransferController: CreepController<CreepType.Transfer> = {

    type: CreepType.Transfer,

    minEnergy: GetRequiredEnergy(['carry', 'move']),

    create(spawn: StructureSpawn, name: string, maxEnergy: number) {
        const body = ['carry', 'move'] as BodyPartConstant[]
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.carry)
        if (maxCount > 0) {
            const count = RandomInt(maxCount + 1)
            if (count > 0) {
                body.splice(1, 0, ...new Array<BodyPartConstant>(count).fill('carry'))
            }
        }
        return spawn.spawnCreep(body, name)
    },

    ticker(creep: Creep<Data>) {
        let transfering = creep.memory.transfering ?? false
        if (transfering) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                transfering = false
                delete creep.memory.transferId
            }
        } else {
            if (creep.store.getFreeCapacity() === 0) {
                transfering = true
                delete creep.memory.pickupId
            }
        }
        if (transfering) {
            creep.memory.transfering = true
        } else {
            delete creep.memory.transfering
        }
        if (transfering) {
            return Transfer(creep)
        }
        else {
            return Pickup(creep)
        }
    },
}
