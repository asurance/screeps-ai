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
}

/**
 * 去掉tuple类型第一个参数
 */
type Tail<T extends unknown[]> = T extends [unknown, ...argv: infer K] ? K : never
