interface Stats {
    gcl: number
    gclLevel: number
    gpl: number
    gplLevel: number
    cpu: number
    bucket: number
    credit: number
}

interface RoomStats {
    name: string
    level: number
    progress: number
}

global.GenerateStats = () => {
    const stats: Stats = {
        gcl: Math.floor(Game.gcl.progress / Game.gcl.progressTotal * 100),
        gclLevel: Game.gcl.level,
        gpl: Math.floor(Game.gpl.progress / Game.gpl.progressTotal * 100),
        gplLevel: Game.gpl.level,
        cpu: Game.cpu.getUsed(),
        bucket: Game.cpu.bucket,
        credit: Game.market.credits,
    }
    console.log(JSON.stringify(stats, undefined, 4))
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName]
        if (room.controller) {
            const roomStats: RoomStats = {
                name: roomName,
                level: room.controller.level,
                progress: Math.floor(room.controller.progress / room.controller.progressTotal * 100)
            }
            console.log(JSON.stringify(roomStats, undefined, 4))
        }
    }
}