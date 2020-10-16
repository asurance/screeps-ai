/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
interface CreepMemory {
    roomName: string
}

interface SpawnMemory {
    roomName: string
}

/**
 * 去掉tuple类型第一个参数
 */
type Tail<T extends unknown[]> = T extends [unknown, ...argv: infer K] ? K : never

declare module NodeJS {
    interface Global {
        GenerateStats(): void
    }
}
