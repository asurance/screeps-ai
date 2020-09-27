import { PriorityQueue } from './priorityQueue'

interface Task {
    publisher: Id<unknown>
}

export const RoomTaskQueue = new Map<string, PriorityQueue<Task>>()
export const RoomCreeps = new Map<string, Creep[]>()
export const CreepTask = new Map<string, Task>()

export function ScanRoomAndCreateTask(room: Room): void {
    const taskQueue = new PriorityQueue<Task>()
    const sources = room.find(FIND_SOURCES)
    sources.forEach(source => {
        const harvestTask: Task = {
            publisher: source.id
        }
        taskQueue.push(harvestTask, 0)
    })
    if (room.controller) {
        const upgradeControlelrTask: Task = {
            publisher: room.controller.id
        }
        taskQueue.push(upgradeControlelrTask, 0)
    }
    RoomTaskQueue.set(room.name, taskQueue)
}

export function ExecuteTask(room: Room, task: Task): void {
    const creeps = RoomCreeps.get(room.name)!
    creeps.some((creep) => {
        const task = CreepTask.get(creep.name)
        if (task) {
            return false
        } else {
            return true
        }
    })
}
