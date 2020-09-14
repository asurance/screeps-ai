import { CreepController, EnergyMap, GetRequiredEnergy } from './baseCreep'
import { Harvest } from './harvest'
import { Upgrade } from './upgrade'
import { RandomInt } from './util'

interface Data extends MemoryData {
    type: CreepType.Upgrader
    upgrading?: boolean
    harvestId?: Id<Source>
}

export const UpgraderController: CreepController<CreepType.Upgrader> = {

    type: CreepType.Upgrader,

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
        let upgrading = creep.memory.upgrading ?? false
        if (upgrading) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                upgrading = false
            }
        } else {
            if (creep.store.getFreeCapacity() === 0) {
                upgrading = true
                delete creep.memory.harvestId
            }
        }
        if (upgrading) {
            creep.memory.upgrading = true
        } else {
            delete creep.memory.upgrading
        }
        if (upgrading) {
            return Upgrade(creep)
        } else {
            return Harvest(creep)
        }
    },
} 