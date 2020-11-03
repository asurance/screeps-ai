import { WrapLoop } from './util/errorMapper'
import { CheckAndGeneratePixel } from './util/pixel'
import { HarvestController } from './harvester'
import { MoveCreep } from './util/util'
import { SpawnController } from './spawnTask'
import { Patch } from './patch'
import { OnCreepDead, Scan } from './globalMap'

const controllerMap: { [key: string]: typeof HarvestController } = {
    harvester: HarvestController
}

const creepStateMap: { [key in CreepState]: (creep: Creep) => void } = {
    [CreepState.born]: (creep) => {
        const controller = controllerMap[creep.memory.role]
        controller.born(creep)
        creep.memory.state = CreepState.work
    },
    [CreepState.work]: (creep) => {
        const controller = controllerMap[creep.memory.role]
        if (creep.ticksToLive! <= 1) {
            controller.dead(creep)
        } else {
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
        }
    },
}

export const loop = WrapLoop(() => {
    if (!Memory.play) {
        return
    }

    Patch()

    Scan()

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        SpawnController.work(spawn)
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (!creep.spawning) {
            creepStateMap[creep.memory.state](creep)
        }
    }

    if (Game.time % 10 === 0) {
        for (const creepName in Memory.creeps) {
            if (!(creepName in Game.creeps)) {
                const creepInfo = Memory.creeps[creepName]
                OnCreepDead(creepName, creepInfo.roomName)
                delete Memory.creeps[creepName]
            }
        }
    }

    CheckAndGeneratePixel()
})