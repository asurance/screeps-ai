import { CreepController, GetRequiredEnergy } from './creepController'
import { Harvest } from './harvest'
import { RandomInt } from './util'

interface Data extends CreepMemoryData {
    type: CreepType.Harvester
    harvestId?: Id<Source>
}

export const HarvesterController: CreepController<CreepType.Harvester> = {

    type: CreepType.Harvester,

    minEnergy: GetRequiredEnergy(['work', 'move']),

    create(spawn: StructureSpawn, name: string, maxEnergy: number) {
        const body = ['work', 'move'] as BodyPartConstant[]
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work)
        if (maxCount > 0) {
            const count = RandomInt(maxCount + 1)
            if (count > 0) {
                body.splice(1, 0, ...new Array<BodyPartConstant>(count).fill('work'))
            }
        }
        return spawn.spawnCreep(body, name)
    },

    ticker(creep: Creep<Data>) {
        return Harvest(creep)
    },
}