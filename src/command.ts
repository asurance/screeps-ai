import { Harvest, SetCreepHarvest } from './harvest'
import { SetCreepUpdateController, UpdateController } from './updateController'

/**
 * 命令声明表
 */
export interface CommandMap {
    [Command.Harvest]: typeof Harvest
    [Command.UpdateController]: typeof UpdateController
}

export interface ICommand {
    (creep: Creep): unknown
}

/**
 * 设置命令表
 */
const SetCommandMap = {
    [Command.Harvest]: SetCreepHarvest,
    [Command.UpdateController]: SetCreepUpdateController
}

/**
 * 设置creep命令
 * @param command 命令
 * @param creep creep
 * @param argv 剩余参数
 */
export function SetNextCommand<T extends Command>(command: T, creep: Creep, ...argv: Tail<Parameters<typeof SetCommandMap[T]>>): void {
    delete creep.memory.cmd
    creep.memory.cmd = {
        type: command
    }
    // @ts-expect-error ts暂时无法识别该类型
    SetCommandMap[command](creep, ...argv)
}