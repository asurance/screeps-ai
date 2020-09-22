import { Build, SetCreepBuild } from './build'
import { Harvest, SetCreepHarvest } from './harvest'
import { Pickup, SetCreepPickup } from './pickup'
import { Repair, SetCreepRepair } from './repair'
import { SetCreepTransfer, Transfer } from './transfer'
import { SetCreepUpgradeController, UpdateController } from './upgradeController'
import { SetCreepWithdraw, Withdraw } from './withdraw'

/**
 * 命令声明表
 */
export interface CommandMap {
    [Command.Harvest]: typeof Harvest
    [Command.UpgradeController]: typeof UpdateController
    [Command.Transfer]: typeof Transfer
    [Command.Pickup]: typeof Pickup
    [Command.Withdraw]: typeof Withdraw
    [Command.Build]: typeof Build
    [Command.Repair]: typeof Repair
}

export interface ICommand {
    (creep: Creep): unknown
}

/**
 * 设置命令表
 */
const SetCommandMap = {
    [Command.Harvest]: SetCreepHarvest,
    [Command.UpgradeController]: SetCreepUpgradeController,
    [Command.Transfer]: SetCreepTransfer,
    [Command.Pickup]: SetCreepPickup,
    [Command.Withdraw]: SetCreepWithdraw,
    [Command.Build]: SetCreepBuild,
    [Command.Repair]: SetCreepRepair,
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