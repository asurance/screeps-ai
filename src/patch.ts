// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Game {
    killAllCreeps(): void
}

Game.killAllCreeps = () => {
    for (const name in Game.creeps) {
        Game.creeps[name].suicide()
        delete Memory.creeps[name]
    }
}