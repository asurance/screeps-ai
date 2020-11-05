import { WrapLoop } from './util/errorMapper'
import { CheckAndGeneratePixel } from './util/pixel'
import { MoveCreep } from './util/util'
import { SpawnController } from './spawnTask'
import { Patch } from './patch'
import { OnCreepDead, Scan } from './globalMap'
import { controllerMap } from './controllerMap'

const creepStateMap: { [key in CreepState]: (creep: Creep) => void } = {
    [CreepState.born]: (creep) => {
        const controller = controllerMap[creep.memory.role]
        controller.born(creep)
        creep.memory.state = CreepState.work
    },
    [CreepState.work]: (creep) => {
        const controller = controllerMap[creep.memory.role]
        let finishMove = true
        if (creep.memory.moving) {
            finishMove = MoveCreep(creep)
            if (finishMove) {
                delete creep.memory.moving
            }
        }
        if (finishMove) {
            controller.work(creep)
        }
    },
}

export const loop = WrapLoop(() => {

    Patch()

    if (!Memory.play) {
        return
    }


    Scan()

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        SpawnController.work(spawn)
    }

    const creepNameSet = new Set(Object.keys(Memory.creeps))
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (!creep.spawning) {
            creepStateMap[creep.memory.state](creep)
        }
        creepNameSet.delete(creepName)
    }
    creepNameSet.forEach(creepName => {
        const creepInfo = Memory.creeps[creepName]
        OnCreepDead(creepName, creepInfo.roomName)
        controllerMap[creepInfo.role].onDead(creepInfo)
        delete Memory.creeps[creepName]
    })

    CheckAndGeneratePixel()
})