import { controllerMap } from './controllerMap'
import { ClearTask, GetTask } from './globalTask'

export const SpawnController = {
    work: (spawn: StructureSpawn): void => {
        if (!spawn.spawning) {
            const tasks = spawn.room.memory.spawnTask
            let spawnTask: Id<SpawnTask> | null = null
            for (const task of tasks) {
                const role = GetTask(task).role
                const bodyparts = controllerMap[role].spawn(spawn)
                if (bodyparts.length > 0) {
                    const result = spawn.spawnCreep(bodyparts, `${spawn.name}-${role}-${Game.time}`, {
                        memory: {
                            role,
                            roomName: '',
                            state: CreepState.born
                        }
                    })
                    if (result === OK) {
                        spawnTask = task
                        break
                    }
                }
            }
            if (spawnTask) {
                _.pull(tasks, spawnTask)
                ClearTask(spawnTask)
            }
        }
    }
}