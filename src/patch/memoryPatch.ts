global.ClearMemory = () => {
    for (const key in Memory) {
        delete Memory[key as keyof Memory]
    }
    Memory.tasks = {}
}
if (!Memory.tasks) {
    Memory.tasks = {}
}

export function GetTask<T>(taskId: Id<T>): T {
    return Memory.tasks[taskId] as T
}

export function SetTask<T>(taskId: Id<T>, task: T): void {
    Memory.tasks[taskId] = task
}

export function ClearTask<T>(taskId: Id<T>): void {
    delete Memory.tasks[taskId]
}