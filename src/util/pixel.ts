import { ReservedCPU } from './config'

/**
 * 检测并CPU剩余过量并生成pixel
 */
export function CheckAndGeneratePixel(): void {
    if (Game.cpu.bucket >= ReservedCPU + PIXEL_CPU_COST) {
        Game.cpu.generatePixel()
    }
}