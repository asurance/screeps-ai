/**
 * creep信息
 */
export const creepInfo = CreateCreepInfo()

function CreateCreepInfo(): Map<Strategy, Map<Command | null, Creep[]>> {
    const creepInfo = new Map<Strategy, Map<Command | null, Creep[]>>()
    // 数据预处理
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        let map = creepInfo.get(creep.memory.strategy.type)
        if (!map) {
            map = new Map<Command | null, Creep[]>()
            creepInfo.set(creep.memory.strategy.type, map)
        }
        const key = creep.memory.cmd?.type ?? null
        const list = map.get(key)
        if (list) {
            list.push(creep)
        } else {
            map.set(key, [creep])
        }
    }
    return creepInfo
}