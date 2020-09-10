for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName]
    if (!spawn.spawning) {
        console.log(spawn.name)
        const result = spawn.spawnCreep(['carry', 'move'], 'worker')
        if (result !== 0) {
            console.log(result)
        }
    }
}
for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName]
    creep.moveTo(Math.random() < 0.5 ? 1 : -1, Math.random() < 0.5 ? 1 : -1)
}