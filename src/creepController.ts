import { CanHarvestTask, HarvestTask, MoveTask } from './task'

export class CreepController {
    static creeps: { [name: string]: MoveTask | HarvestTask } = {}
    static freeCreeps = new Set<Creep>()
    static registerHarvestTask(task: CanHarvestTask, room: Room): void {
        // if (this.freeCreeps.size > 0) {

        // } else {
        //     room.find
        // }
    }
}