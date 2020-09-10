import { Walker } from './walker'

let count = 0
for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName]
    if (creep.memory.type === 'worker') {
        const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
        if (target) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        }
        count++
    } else if (creep.memory.type === Walker.type) {
        Walker.count++
        Walker.tick(creep, creep.room)
    }
}
for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName]
    if (!spawn.spawning && spawn.store['energy'] >= 200) {
        if (Walker.count > 0) {
            const name = `worker_${count}`
            const result = spawn.spawnCreep(['work', 'move'], `worker_${count}`)
            if (result === OK) {
                Memory.creeps[name].type = 'worker'
            } else {
                console.log(result)
            }
        } else {
            const result = Walker.create(spawn, spawn.room)
            if (result !== OK) {
                console.log(result)
            }
        }
    }
}