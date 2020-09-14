import { CreepController, EnergyMap, GetRequiredEnergy } from './baseCreep'
import { Harvest } from './harvest'
import { Transfer } from './transfer'
import { RandomInt } from './util'

interface Data extends MemoryData {
    type: CreepType.Harvester
    transfering?: boolean
    harvestId?: Id<Source>
    transferId?: Id<AnyStructure>
}

export const HarvesterController: CreepController<CreepType.Harvester> = {

    type: CreepType.Harvester,

    minEnergy: GetRequiredEnergy(['work', 'carry', 'move']),

    create(spawn: StructureSpawn, name: string, maxEnergy: number) {
        const body = ['work', 'carry', 'move'] as BodyPartConstant[]
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / EnergyMap.carry)
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
                delete creep.memory.harvestId
            }
        }
        if (transfering) {
            creep.memory.transfering = true
        } else {
            delete creep.memory.transfering
        }
        if (transfering) {
            return Transfer(creep)
        } else {
            return Harvest(creep)
        }
    },
}