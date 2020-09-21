import { CommandMap } from './command'

/**
 * 策略
 */
export interface IStrategy {
    /**
     * 所需最小能量
     */
    readonly minEnergy: number
    /**
     * 创建的组件列表
     * @param maxEnergy 可提供的最大能量
     * @return 组件列表
     */
    create(maxEnergy: number): BodyPartConstant[]
    /**
     * 初始化策略
     * @param creep Creep
     */
    initStrategy(creep: Creep): void
    /**
     * 启动Creep
     * @param creep Creep
     */
    start(creep: Creep): void
    /**
     * Command完成后回调
     */
    callbackMap: { [key in Command]?: (creep: Creep, result: ReturnType<CommandMap[key]>) => void }
}