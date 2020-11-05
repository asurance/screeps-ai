import { GetTask } from './globalTask'
import { GetRequiredEnergy, SetMoveTarget } from './util/util'

export type Task = Id<SourceTask>

export interface HarvsetData {
    task: Task
}

const singleCost = GetRequiredEnergy([WORK, CARRY, MOVE])

export const HarvestController = {
    spawn: (spawn: StructureSpawn): BodyPartConstant[] => {
        const count = Math.min(6, Math.floor(spawn.room.energyAvailable / singleCost))
        const out: BodyPartConstant[] = []
        for (let i = 0; i < count; i++) {
            out.push(WORK, CARRY, MOVE)
        }
        return out
    },
    born: (creep: Creep): void => {
        const sourceTask = creep.room.memory.sources.find(s => !(GetTask(s).creep))
        const memory = creep.memory as CreepMemory & HarvsetData
        if (sourceTask) {
            memory.task = sourceTask
            const source = GetTask(sourceTask)
            source.creep = creep.name
            SetMoveTarget(creep, source.containerPositon, 0)
        }
    },
    work: (creep: Creep): void => {
        const memory = creep.memory as CreepMemory & HarvsetData
        const task = GetTask(memory.task)
        let needHarvest = true
        if (creep.store.energy > 0) {
            const site = creep.pos.lookFor('constructionSite').filter(s => s.structureType === STRUCTURE_CONTAINER)[0]
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
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
                }
            }
        }
        if (needHarvest) {
            const source = Game.getObjectById(task.id)!
            creep.harvest(source)
        }
    },
    onDead: (m: CreepMemory): void => {
        const memory = m as CreepMemory & HarvsetData
        const roomMemory = Memory.rooms[memory.roomName]
        if (roomMemory) {
            roomMemory.requireRole.harvester++
        }
        const source = GetTask(memory.task)
        source.creep = ''
    }
}