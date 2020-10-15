import { roomInfoHandler } from './roomInfoHandler'
import { Tick } from './timer'
import { WrapLoop } from './util/errorMapper'

export const loop = WrapLoop(() => {

    Tick()

    roomInfoHandler.update()

    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 500 * 2) {
        Game.cpu.generatePixel()
    }
})