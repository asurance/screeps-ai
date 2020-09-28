import { PriorityQueue } from './priorityQueue'

interface Task {
    publisher: Id<unknown>
}

export const TaskQueue = new PriorityQueue<Task>()

export const CreepTask = new Map<string, Task>()

export function ScanRoomAndCreateTask(room: Room): void {
    const sources = room.find(FIND_SOURCES)
    sources.forEach(source => {
        const harvestTask: Task = {
            publisher: source.id
        }
        TaskQueue.push(harvestTask, 0)
    })
    if (room.controller) {
        const upgradeControlelrTask: Task = {
            publisher: room.controller.id
        }
        TaskQueue.push(upgradeControlelrTask, 0)
    }
}
