/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
interface SourceTask {
    id: Id<Source>
    creeps: string[]
    maxNumber: number
    containerPositon: number
}

interface SpawnTask {
    body: BodyPartConstant[]
    role: string
    taskId: Id<SourceTask>
}

interface RoomMemory {
    sources: Id<SourceTask>[]
}

const enum CreepState {
    born,
    work,
}
interface CreepMemory {
    roomName: string
    role: string
    state: CreepState
    moving?: {
        pos: number
        range: number
    }
}

interface SpawnMemory {
    roomName: string
    task?: Id<SpawnTask>[]
}

interface Memory {
    tasks: {
        [key: string]: unknown
    }
}

/**
 * 去掉tuple类型第一个参数
 */
type Tail<T extends unknown[]> = T extends [unknown, ...argv: infer K] ? K : never

declare module NodeJS {
    interface Global {
        GenerateStats(): void
        ScanRoom(): void
        ClearMemory(): void
    }
}
