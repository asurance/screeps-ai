import { GetRequiredEnergy } from './util/util'

export interface SpawnTask {
    body: BodyPartConstant[]
    role: string
    taskId: string
}

export const SpawnController = {
    work: (spawn: StructureSpawn): void => {
        if (!spawn.spawning) {
            if (spawn.memory.task) {
                const task = Memory.tasks[spawn.memory.task[0]] as SpawnTask
                if (spawn.room.energyAvailable >= GetRequiredEnergy(task.body)) {
                    const harvsetTask = Memory.tasks[task.taskId]
                    const source = spawn.room.memory.sources.find(s => s.id === harvsetTask)!
                    if (source.creeps.length === 0) {
                        spawn.spawnCreep(task.body, `${spawn}-${task.role}-${Game.time}`)
                    }
                }
            }
        }
    }
}