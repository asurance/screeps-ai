import { HarvestController } from './harvester'

export const controllerMap: { [key: string]: typeof HarvestController } = {
    harvester: HarvestController
}