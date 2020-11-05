import { controllerMap } from './controllerMap'

export const SpawnController = {
    work: (spawn: StructureSpawn): void => {
        if (!spawn.spawning) {
            let role = ''
            for (const key in spawn.room.memory.requireRole) {
                if (spawn.room.memory.requireRole[key] > 0) {
                    role = key
                    break
                }
            }
            if (role) {
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
                        spawn.room.memory.requireRole[role]--
                    }
                }
            }
        }
    }
}