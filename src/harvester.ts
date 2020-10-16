// import { HarvestTask } from './harvestTask'
import { SetMoveTarget } from './util/util'

// export class Harvester {
//     readonly creeep: string
//     private harvesting = true
//     private task: HarvestTask
//     constructor(creep: Creep, task: HarvestTask) {
//         this.creeep = creep.name
//         this.task = task
//     }
//     tick(): void {
//         if (this.creeep in Game.creeps) {
//             const creep = Game.creeps[this.creeep]
//             if (this.harvesting) {
//                 if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
//                     this.harvesting = false
//                 }
//             } else {
//                 if (creep.store.energy === 0) {
//                     this.harvesting = true
//                 }
//             }
//             if (this.harvesting) {
//                 const source = Game.getObjectById(this.task.sourceId)
//                 if (source) {
//                     MoveToTarget(creep, source.pos, 1, () => {
//                         creep.harvest(source)
//                     })
//                 }
//             } else {
//                 if (this.task.containerSite) {
//                     const site = Game.getObjectById(this.task.containerSite)
//                 }
//                 const structures = creep.room.lookForAt('structure', this.task.containerX, this.task.containerY)
//                 for (const structure of structures) {
//                     if (structure.structureType === STRUCTURE_CONTAINER) {
//                         const s = structure as StructureContainer
//                         if (s.hits <= CONTAINER_DECAY) {
//                             creep.repair(s)
//                         } else {
//                             if (s.store.getFreeCapacity() > 0) {
//                                 creep.transfer(s, RESOURCE_ENERGY)
//                             } else if (s.hits < s.hitsMax) {
//                                 creep.repair(s)
//                             }
//                         }
//                         break
//                     }
//                 }
//             }
//         }
//     }
// }

export interface Task {
    source: Id<Source>
    containerPosition: number
}

export interface HarvsetData {
    task: Task
}

export const HarvestController = {
    born: (creep: Creep, task: Task): void => {
        const memory = creep.memory as CreepMemory & HarvsetData
        memory.task = task
        SetMoveTarget(creep, task.containerPosition, 0)
    },
    work: (creep: Creep): void => {
        const memory = creep.memory as CreepMemory & HarvsetData
        if (creep.store.energy > 0) {
            let site = creep.pos.lookFor('constructionSite').filter(s => s.structureType === STRUCTURE_CONTAINER)[0]
            if (site) {
                creep.build(site)
            } else {
                const container = creep.pos.lookFor('structure').filter(s => s.structureType === STRUCTURE_CONTAINER)[0]
                if (container) {
                    if (container.hits < container.hitsMax) {
                        creep.repair(container)
                    } else {
                        const source = Game.getObjectById(memory.task.source)!
                        creep.harvest(source)
                    }
                } else {
                    const result = creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
                    if (result === OK) {
                        site = creep.pos.lookFor('constructionSite').filter(s => s.structureType === STRUCTURE_CONTAINER)[0]
                        creep.build(site)
                    }
                }
            }
        } else {
            const source = Game.getObjectById(memory.task.source)!
            creep.harvest(source)
        }
    },
    dead: (creep: Creep): void => {
        creep.drop(RESOURCE_ENERGY)
    }
}