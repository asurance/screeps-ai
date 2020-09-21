/**
 * 配置
 */
interface Config {
    /**
     * 提醒间隔
     */
    notifyInterval: number
    /**
     * 采集者数量
     */
    harvester: number
}

interface Memory {
    /**
     * 配置
     */
    config?: Partial<Config>
}

/**
 * 房间数据
 */
interface RoomMemory {
    sourceInfo: Id<Source>[]
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

/**
 * 去掉tuple类型第一个参数
 */
type Tail<T extends unknown[]> = T extends [unknown, ...argv: infer K] ? K : never
