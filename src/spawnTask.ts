import { GetRequiredEnergy } from './util/util'

export interface SpawnTask {
    body: BodyPartConstant[]
    role: string
}

export const SpawnController = {
    work: (spawn: StructureSpawn): void => {
        if (!spawn.spawning) {
            if (spawn.memory.task) {
                const task = Memory.tasks[spawn.memory.task[0]] as SpawnTask
                if (spawn.room.energyAvailable >= GetRequiredEnergy(task.body)) {
                    const result = spawn.spawnCreep(task.body, `${spawn}-${task.role}-${Game.time}`, {
                        memory: {
                            roomName: spawn.room.name,
                            role: '',
                        }
                    })
                    if (result === OK) {
                        delete Memory.tasks[spawn.memory.task[0]]
                        if (spawn.memory.task.length === 1) {
                            delete spawn.memory.task
                        } else {
                            spawn.memory.task.shift()
                        }
                    }
                }
            }
        }
    }
}