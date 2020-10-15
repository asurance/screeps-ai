import { roomInfoHandler } from './roomInfoHandler'
import { Tick } from './timer'

export function loop(): void {

    Tick()

    roomInfoHandler.update()

    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 500 * 2) {
        Game.cpu.generatePixel()
    }
}