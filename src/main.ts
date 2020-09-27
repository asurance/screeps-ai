import { Tick } from './timer'

export function loop(): void {
    for (const creepName in Memory.creeps) {
        if (!(creepName in Game.creeps)) {
            delete Memory.creeps[creepName]
        }
    }

    Tick()
}