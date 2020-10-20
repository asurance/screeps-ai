import { WrapLoop } from './util/errorMapper'
import { CheckAndGeneratePixel } from './util/pixel'
import { HarvestController } from './harvester'
import { MoveCreep } from './util/util'
import { SpawnController } from './spawnTask'
import { Scan, SpawnMap } from './globalMap'
import './patch'
import { GetTask } from './patch/memoryPatch'

console.log('Updated')

export const loop = WrapLoop(() => {

    Scan()

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        SpawnController.work(spawn)
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (!creep.spawning) {
            if (!creep.memory.role) {
                const spawn = Game.spawns[SpawnMap.get(creep.room.name)![0]]
                const spawnTasks = spawn.memory.task!
                const sourceTaskId = spawnTasks.shift()!
                const sourceTask = GetTask(sourceTaskId)
                spawnTasks.push(sourceTaskId)
                spawn.memory.task = spawnTasks
                HarvestController.born(creep, sourceTask.taskId)
                creep.memory.role = 'harvester'
            }
            if (creep.ticksToLive! <= 1) {
                HarvestController.dead(creep)
                delete Memory.creeps[creep.name]
            } else {
                let finishMove = true
                if (creep.memory.moving) {
                    finishMove = MoveCreep(creep)
                    if (finishMove) {
                        delete creep.memory.moving
                    }
                }
                if (finishMove) {
                    HarvestController.work(creep)
                }
            }
        }
    }

    CheckAndGeneratePixel()
})