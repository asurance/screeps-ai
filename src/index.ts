let count = 0
let hasWalker = false
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
    } else if (creep.memory.type === 'walker') {
        hasWalker = true
        const result = creep.room.lookAtArea(
            Math.max(0, creep.pos.y - 1),
            Math.max(0, creep.pos.x - 1),
            Math.min(49, creep.pos.y + 1),
            Math.min(49, creep.pos.x + 1), true)
            .filter(r => {
                return r.terrain !== 'wall'
            })
        if (result.length > 0) {
            const next = Math.floor(Math.random() * result.length)
            creep.moveTo(result[next].x, result[next].y)
        }
    }
}
for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName]
    if (!spawn.spawning && spawn.store.getFreeCapacity('energy') >= 200) {
        if (hasWalker) {
            const name = `worker_${count}`
            const result = spawn.spawnCreep(['work', 'move'], `worker_${count}`)
            if (result === OK) {
                Memory.creeps[name].type = 'worker'
            } else {
                console.log(result)
            }
        } else {
            const name = 'walker'
            const result = spawn.spawnCreep(['move'], 'walker')
            if (result === OK) {
                Memory.creeps[name].type = 'walker'
            } else {
                console.log(result)
            }
        }
    }
}