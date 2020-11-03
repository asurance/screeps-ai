import { CreepMap } from './globalMap'
import { GetRequiredEnergy } from './util/util'

export const SpawnController = {
    work: (spawn: StructureSpawn): void => {
        if (!spawn.spawning) {
            // TODO 不spawning的时候不用一直查询
            const creeps = CreepMap.get(spawn.room.name) ?? []
            const restMap = _.clone(spawn.room.memory.requireRole)
            _.forEach(creeps, (creepName) => {
                const creep = Game.creeps[creepName]
                if (creep && (creep.memory.role in restMap)) {
                    restMap[creep.memory.role]--
                }
            })
            let role = ''
            for (const key in restMap) {
                if (restMap[key] > 0) {
                    role = key
                    break
                }
            }
            if (role) {
                // TODO 获取相对应的身体组件
                if (spawn.room.energyAvailable >= GetRequiredEnergy([WORK, MOVE, CARRY])) {
                    spawn.spawnCreep([WORK, MOVE, CARRY], `${spawn.name}-${role}-${Game.time}`, {
                        memory: {
                            role,
                            roomName: '',
                            state: CreepState.born
                        }
                    })
                }
            }
        }
    }
}