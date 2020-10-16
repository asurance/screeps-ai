import { WrapLoop } from './util/errorMapper'
import { CheckAndGeneratePixel } from './util/pixel'
import './patch'
import { HarvestController, Task } from './harvester'
import { GetRequiredEnergy, LookForInRange, MoveCreep, SerializeRoomPos } from './util/util'
import { obstacles } from './util/global'

const body = [WORK, CARRY, MOVE]

export const loop = WrapLoop(() => {
    const spawn = Game.spawns['Home']
    if (!spawn.spawning && Object.keys(Game.creeps).length === 0) {
        if (spawn.room.energyAvailable >= GetRequiredEnergy(body)) {
            spawn.spawnCreep(body, `${spawn.name}-harvester-${Game.time}`, {
                memory: {
                    roomName: spawn.room.name,
                    role: '',
                }
            })
        }
    }

    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (!creep.spawning) {
            if (!creep.memory.role) {
                creep.memory.role = 'harvester'
                const source = spawn.pos.findClosestByPath(FIND_SOURCES)!
                const structure = LookForInRange('structure', source, 1)
                    .filter(s => obstacles.has(s.structure.structureType))
                const terrain = LookForInRange('terrain', source, 1)
                    .filter(t => t.terrain !== 'wall'
                        && structure.every(s => s.x !== t.x && s.y !== t.y))
                const task: Task = {
                    source: source.id,
                    containerPosition: SerializeRoomPos(terrain[0]),
                }
                HarvestController.born(creep, task)
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