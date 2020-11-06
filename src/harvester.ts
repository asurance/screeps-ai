import { GetTask, SetTask } from './globalTask'
import { GetRequiredEnergy, SetMoveTarget } from './util/util'

export type Task = Id<SourceTask>

export interface HarvsetData {
    task: Task
}

const minCost = GetRequiredEnergy([WORK, CARRY, MOVE])
const stepCost = GetRequiredEnergy([WORK, WORK, MOVE])

export const HarvestController = {
    spawn: (spawn: StructureSpawn): BodyPartConstant[] => {
        if (spawn.room.energyAvailable >= minCost) {
            const out = [WORK, CARRY, MOVE]
            const rest = spawn.room.energyAvailable - minCost
            const count = Math.min(2, Math.floor(rest / stepCost))
            for (let i = 0; i < count; i++) {
                out.push(WORK, WORK, MOVE)
            }
            return out
        } else {
            return []
        }
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
        const index = _.findIndex(roomMemory.sources, v => v === memory.task)
        const taskId = `Spawn: ${m.roomName}-harvester-${index}` as Id<SpawnTask>
        SetTask(taskId, { role: 'harvester' })
        roomMemory.spawnTask.push(taskId)
        const source = GetTask(memory.task)
        source.creep = ''
    }
}