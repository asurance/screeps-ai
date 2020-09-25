import { Task, TaskType } from './task'

export interface HarvestTask extends Task {
    type: TaskType.harvest
    publisher: Id<Source>
}

export function ScanRoomSource(room: Room) {
    const sources = room.find(FIND_SOURCES)
}