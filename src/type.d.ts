/**
 * 配置
 */
interface Config {
    /**
     * 提醒间隔
     */
    notifyInterval: number
}

interface Memory {
    /**
     * 配置
     */
    config?: Partial<Config>
    harvester?: number
    transfer?: number
    upgrader?: number
    builder?: number
    repairer?: number
}

/**
 * 策略数据
 */
interface StrategyData {
    /**
     * 策略类型
     */
    type: Strategy
}

/**
 * 命令数据
 */
interface CommandData {
    /**
     * 命令类型
     */
    type: Command,
}

interface CreepMemory {
    /**
     * 策略数据
     */
    strategy: StrategyData
    /**
     * 命令数据
     */
    cmd?: CommandData
}

/**
 * 策略类型
 */
const enum Strategy {
    /**
     * 采集者
     */
    Harvester = 'harvester'
}

/**
 * 命令类型
 */
const enum Command {
    /**
     * 采集
     */
    Harvest = 'harvest',
    /**
     * 移动
     */
    Move = 'move',
}

type Tail<T extends unknown[]> = T extends [unknown, ...argv: infer K] ? K : never
type G = Tail<[number, string]>
