import { roomInfoHandler } from './roomInfoHandler'
import { Tick } from './timer'
import { WrapLoop } from './util/errorMapper'
import { CheckAndGeneratePixel } from './util/pixel'
import './patch'

export const loop = WrapLoop(() => {

    Tick()

    roomInfoHandler.update()

    CheckAndGeneratePixel()
})