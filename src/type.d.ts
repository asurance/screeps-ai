/* eslint-disable @typescript-eslint/prefer-namespace-keyword */

interface Memory {
    tasks: {
        [key: string]: unknown
    }
}

interface SourceTask {
    id: Id<Source>
    creeps: string[]
    containerPositon: number
}

interface RoomMemory {
    sources: SourceTask[]
}

interface CreepMemory {
    roomName: string
    role: string
    moving?: {
        pos: number
        range: number
    }
}

interface SpawnMemory {
    roomName: string
    task?: string[]
}

/**
 * 去掉tuple类型第一个参数
 */
type Tail<T extends unknown[]> = T extends [unknown, ...argv: infer K] ? K : never

declare module NodeJS {
    interface Global {
        GenerateStats(): void
        ScanRoom(): void
    }
}
