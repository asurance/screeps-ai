import { HarvestTask } from './harvestTask'
import { MoveToTarget } from './util'

export class Harvester {
    readonly creeep: string
    private task: HarvestTask
    constructor(creep: Creep, task: HarvestTask) {
        this.creeep = creep.name
        this.task = task
    }
    tick(): void {
        if (this.creeep in Game.creeps) {
            const creep = Game.creeps[this.creeep]
            if (creep.store.energy > 0) {
                const structures = creep.room.lookForAt('structure', this.task.containerX, this.task.containerY)
                for (const structure of structures) {
                    if (structure.structureType === STRUCTURE_CONTAINER) {
                        const s = structure as StructureContainer
                        if (s.hits <= CONTAINER_DECAY) {
                            creep.repair(s)
                        } else {
                            if (s.store.getFreeCapacity() > 0) {
                                creep.transfer(s, RESOURCE_ENERGY)
                            } else if (s.hits < s.hitsMax) {
                                creep.repair(s)
                            }
                        }
                        break
                    }
                }
            } else {
                const source = Game.getObjectById(this.task.sourceId)
                if (source) {
                    MoveToTarget(creep, source.pos, 1, () => {
                        creep.harvest(source)
                    })
                }
            }
        }
    }
}