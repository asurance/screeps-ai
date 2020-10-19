import { WrapLoop } from './util/errorMapper'
import { CheckAndGeneratePixel } from './util/pixel'
import './patch'
import { HarvestController, Task } from './harvester'
import { MoveCreep } from './util/util'
import { SpawnController, SpawnTask } from './spawnTask'
import { Scan } from './globalMap'

export const loop = WrapLoop(() => {
    Scan()
    const spawn = Game.spawns['Home']
    SpawnController.work(spawn)

    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (!creep.spawning) {
            if (!creep.memory.role) {
                creep.memory.role = 'harvester'
                const taskIds = spawn.memory.task ?? []
                const taskId = taskIds.shift()!
                const task = Memory.tasks[taskId] as SpawnTask
                taskIds.push(taskId)
                HarvestController.born(creep, Memory.tasks[task.taskId] as Task)
            }
            if (creep.ticksToLive! <= 1) {
                HarvestController.dead(creep)
                delete Memory.creeps[creep.name]
            } else {
                let result = true
                if (creep.memory.moving) {
                    result = MoveCreep(creep)
                    if (result) {
                        delete creep.memory.moving
                    }
                }
                if (result) {
                    HarvestController.work(creep)
                }
            }
        }
    }

    CheckAndGeneratePixel()
})