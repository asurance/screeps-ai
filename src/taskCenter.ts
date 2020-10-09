export interface Task {
    priority: number
    query(creep: Creep): boolean
    assign(creep: Creep): boolean
}

export class TaskCenter {

    private static TaskMap = new Map<number, Task>()

    private static TaskID = 0

    private static TaskQueue: Task[] = []

    static PublishTask(task: Task): number {
        this.TaskQueue.push(task)
        this.TaskMap.set(this.TaskID, task)
        return this.TaskID++
    }

    static QueryTask(creep: Creep): boolean {
        const validTasks = this.TaskQueue.filter(task => task.query(creep))
        const topPriority = validTasks.length > 0 ?
            validTasks.reduce((pre, cur) => pre.priority > cur.priority ? pre : cur) :
            null
        if (topPriority) {
            if (topPriority.assign(creep)) {
                const index = this.TaskQueue.indexOf(topPriority)
                this.TaskQueue.splice(index, 1)
            }
            return true
        } else {
            return false
        }
    }

    static GetTaskByID(id: number): Task | null {
        return this.TaskMap.get(id) ?? null
    }
}