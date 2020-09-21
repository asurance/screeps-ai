// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Game {
    /**
     * 杀死所有Creep
     */
    killAllCreeps(): void
    /**
     * 清空房间信息
     */
    clearRoomInfo(): void
    /**
     * 重启
     */
    Restart(): void
}

Game.killAllCreeps = () => {
    for (const name in Game.creeps) {
        Game.creeps[name].suicide()
        delete Memory.creeps[name]
    }
}

Game.clearRoomInfo = () => {
    for (const name in Memory.rooms) {
        delete Memory.rooms[name]
    }
}

Game.Restart = () => {
    Game.clearRoomInfo()
    Game.killAllCreeps()
}