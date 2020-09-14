import { CreepController, EnergyMap, GetRequiredEnergy } from './baseCreep'
import { Build } from './build'
import { Harvest } from './harvest'
import { RandomInt } from './util'

interface Data extends MemoryData {
    type: CreepType.Builder
    building?: boolean
    harvestId?: Id<Source>
    buildId?: Id<ConstructionSite<BuildableStructureConstant>>
}

export const BuilderController: CreepController<CreepType.Builder> = {

    type: CreepType.Builder,

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
        let building = creep.memory.building ?? false
        if (building) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                building = false
                delete creep.memory.buildId
            }
        } else {
            if (creep.store.getFreeCapacity() === 0) {
                building = true
                delete creep.memory.harvestId
            }
        }
        if (building) {
            creep.memory.building = true
        } else {
            delete creep.memory.building
        }
        if (building) {
            return Build(creep)
        }
        else {
            return Harvest(creep)
        }
    },
} 