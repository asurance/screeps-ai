export function GetTask<T>(taskId: Id<T>): T {
    if (Memory.tasks) {
        if (taskId in Memory.tasks) {
            return Memory.tasks[taskId] as T
        } else {
            throw new Error(`Lack task info of ${taskId}`)
        }
    } else {
        throw new Error(`Lack task info of ${taskId}`)
    }
}

export function SetTask<T>(taskId: Id<T>, task: T): void {
    if (Memory.tasks) {
        Memory.tasks[taskId] = task
    } else {
        Memory.tasks = {
            [taskId]: task
        }
    }
}

export function ClearTask<T>(taskId: Id<T>): void {
    if (Memory.tasks) {
        delete Memory.tasks[taskId]
    }
}