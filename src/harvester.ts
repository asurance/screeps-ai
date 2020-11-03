import { GetTask } from './globalTask'
import { SerializeRoomPos, SetMoveTarget } from './util/util'

export type Task = Id<SourceTask>

export interface HarvsetData {
    task: Task
}

export const HarvestController = {
    born: (creep: Creep): void => {
        const sourceTask = creep.room.memory.sources.find(s => GetTask(s).creeps.length > 0)
        const memory = creep.memory as CreepMemory & HarvsetData
        if (sourceTask) {
            memory.task = sourceTask
            const source = GetTask(sourceTask)
            source.creeps.push(creep.name)
            if (source.creeps.length === 1) {
                SetMoveTarget(creep, source.containerPositon, 0)
            } else {
                SetMoveTarget(creep, Game.getObjectById(source.id)!.pos, 1)
            }
        }
    },
    work: (creep: Creep): void => {
        const memory = creep.memory as CreepMemory & HarvsetData
        const task = GetTask(memory.task)
        let needHarvest = true
        if (task.containerPositon === SerializeRoomPos(creep.pos)) {
            if (creep.store.energy > 0) {
                let site = creep.pos.lookFor('constructionSite').filter(s => s.structureType === STRUCTURE_CONTAINER)[0]
                if (site) {
                    creep.build(site)
                    needHarvest = false
                } else {
                    const container = creep.pos.lookFor('structure').filter(s => s.structureType === STRUCTURE_CONTAINER)[0]
                    if (container) {
                        if (container.hits < container.hitsMax) {
                            creep.repair(container)
                            needHarvest = false
                        }
                    } else {
                        const result = creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
                        if (result === OK) {
                            site = creep.pos.lookFor('constructionSite').filter(s => s.structureType === STRUCTURE_CONTAINER)[0]
                            creep.build(site)
                            needHarvest = false
                        }
                    }
                }
            }
        }
        if (needHarvest) {
            const source = Game.getObjectById(task.id)!
            creep.harvest(source)
        }
    },
    dead: (creep: Creep): void => {
        const memory = creep.memory as CreepMemory & HarvsetData
        const source = GetTask(memory.task)
        const index = source.creeps.indexOf(creep.name)
        if (index >= 0) {
            source.creeps.splice(index, 1)
        }
        creep.drop(RESOURCE_ENERGY)
    }
}