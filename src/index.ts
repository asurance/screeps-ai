import { WrapLoop } from './util/errorMapper'
import { CheckAndGeneratePixel } from './util/pixel'
import { HarvestController, Task } from './harvester'
import { MoveCreep } from './util/util'
import { SpawnController, SpawnTask } from './spawnTask'
import { Scan } from './globalMap'
import './clearMemory'
import './patch'

export const loop = WrapLoop(() => {
    Scan()
    const spawn = Game.spawns['Home']
    if (!spawn) {
        return
    }
    SpawnController.work(spawn)

    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (!creep.spawning) {
            if (!creep.memory.role) {
                const taskIds = spawn.memory.task ?? []
                const taskId = taskIds.shift()!
                const task = Memory.tasks[taskId] as SpawnTask
                taskIds.push(taskId)
                spawn.memory.task = taskIds
                HarvestController.born(creep, Memory.tasks[task.taskId] as Task)
                creep.memory.role = 'harvester'
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