export interface Task {
    type: TaskType
    publisher: Id<unknown>
    doer: Id<unknown> | null
}

export const enum TaskType {

}

