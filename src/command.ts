import { Harvest, SetCreepHarvest } from './harvest'
import { Move, SetCreepMove } from './move'

export interface CommandMap {
    [Command.Move]: typeof Move
    [Command.Harvest]: typeof Harvest
}

const SetCommandMap = {
    [Command.Move]: SetCreepMove,
    [Command.Harvest]: SetCreepHarvest,
}

export function SetNextCommand<T extends Command>(command: T, creep: Creep, ...argv: Tail<Parameters<typeof SetCommandMap[T]>>) {
    delete creep.memory.cmd
    creep.memory.cmd = {
        type: command
    }
    //@ts-expect-error todo
    SetCommandMap[command](creep, ...argv)
}