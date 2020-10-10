import { HarvestTask } from './harvestTask'

export class HarvestCenter {
    private tasks: HarvestTask[] = []
    assignTask(task: HarvestTask): void {
        this.tasks.push(task)
    }
}

export const harvestCenter = new HarvestCenter()