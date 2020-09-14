Game.killAllCreeps = () => {
    for (const name in Game.creeps) {
        Game.creeps[name].suicide()
        delete Memory.creeps[name]
    }
}