import { GetTask } from './globalTask'
import { GetRequiredEnergy } from './util/util'

export const SpawnController = {
    work: (spawn: StructureSpawn): void => {
        if (!spawn.spawning) {
            if (spawn.memory.task) {
                const task = GetTask(spawn.memory.task[0])
                if (spawn.room.energyAvailable >= GetRequiredEnergy(task.body)) {
                    const sourceTask = GetTask(task.taskId)
                    if (sourceTask.creeps.length === 0) {
                        spawn.spawnCreep(task.body, `${spawn.name}-${task.role}-${Game.time}`)
                    }
                }
            }
        }
    }
}