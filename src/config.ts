/**
 * 默认配置
 */
const defualtConfig: Config = {
    notifyInterval: 24 * 60,
    harvester: 3,
    transferer: 7,
}

/**
 * 项目采用配置
 */
export const config: Readonly<Config> = Memory.config ? { ...defualtConfig, ...Memory.config } : defualtConfig