import { Tick } from './timer'

export function loop(): void {

    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 500 * 2) {
        Game.cpu.generatePixel()
    }

    // 清理过期creep
    for (const creepName in Memory.creeps) {
        if (!(creepName in Game.creeps)) {
            delete Memory.creeps[creepName]
        }
    }

    Tick()
}