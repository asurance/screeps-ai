/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
interface SourceTask {
    id: Id<Source>
    creep: string
    containerPositon: number
}

interface RoomMemory {
    sources: Id<SourceTask>[]
    requireRole: {
        [role: string]: number
    }
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
}

interface Memory {
    play: boolean
    tasks: {
        [key: string]: unknown
    }
}

/**
 * 去掉tuple类型第一个参数
 */
type Tail<T extends unknown[]> = T extends [unknown, ...argv: infer K] ? K : never
