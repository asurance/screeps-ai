import { roomInfo } from './roomInfo'
import { Tick } from './timer'

export function loop(): void {

    Tick()

    roomInfo.update()

    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 500 * 2) {
        Game.cpu.generatePixel()
    }
}