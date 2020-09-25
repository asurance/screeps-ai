import { PriorityQueue } from '../priorityQueue'

export interface Task {
    type: TaskType
    publisher: Id<unknown>
}

export const enum TaskType {
    harvest = 'harvest'
}

export const TaskQueue = new PriorityQueue<Task>()