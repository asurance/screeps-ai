interface Stats {
    gcl: number
    gclLevel: number
    gpl: number
    gplLevel: number
    cpu: number
    bucket: number
    credit: number
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
}