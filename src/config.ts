/**
 * 默认配置
 */
const defualtConfig: Config = {
    notifyInterval: 24 * 60,
    harvester: 2,
    transferer: 8,
    worker: 5,
}

/**
 * 项目采用配置
 */
export const config: Readonly<Config> = Memory.config ? { ...defualtConfig, ...Memory.config } : defualtConfig