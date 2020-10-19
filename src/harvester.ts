import { SetMoveTarget } from './util/util'

export type Task = Id<Source>

export interface HarvsetData {
    task: Task
}

export const HarvestController = {
    born: (creep: Creep, task: Task): void => {
        const memory = creep.memory as CreepMemory & HarvsetData
        memory.task = task
        const source = creep.room.memory.sources.find(s => s.id === task)!
        source.creeps.push(creep.name)
        SetMoveTarget(creep, source.containerPositon, 0)
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
                        const source = Game.getObjectById(memory.task)!
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
            const source = Game.getObjectById(memory.task)!
            creep.harvest(source)
        }
    },
    dead: (creep: Creep): void => {
        const memory = creep.memory as CreepMemory & HarvsetData
        const source = creep.room.memory.sources.find(s => s.id === memory.task)!
        const index = source.creeps.indexOf(creep.name)
        if (index >= 0) {
            source.creeps.splice(index, 1)
        }
        creep.drop(RESOURCE_ENERGY)
    }
}