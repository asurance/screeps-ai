"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNextCommand = void 0;
const build_1 = require("./build");
const harvest_1 = require("./harvest");
const pickup_1 = require("./pickup");
const repair_1 = require("./repair");
const transfer_1 = require("./transfer");
const upgradeController_1 = require("./upgradeController");
const withdraw_1 = require("./withdraw");
/**
 * 设置命令表
 */
const SetCommandMap = {
    ["harvest" /* Harvest */]: harvest_1.SetCreepHarvest,
    ["updateController" /* UpgradeController */]: upgradeController_1.SetCreepUpgradeController,
    ["transfer" /* Transfer */]: transfer_1.SetCreepTransfer,
    ["pickup" /* Pickup */]: pickup_1.SetCreepPickup,
    ["withdraw" /* Withdraw */]: withdraw_1.SetCreepWithdraw,
    ["build" /* Build */]: build_1.SetCreepBuild,
    ["repair" /* Repair */]: repair_1.SetCreepRepair,
};
/**
 * 设置creep命令
 * @param command 命令
 * @param creep creep
 * @param argv 剩余参数
 */
function SetNextCommand(command, creep, ...argv) {
    delete creep.memory.cmd;
    creep.memory.cmd = {
        type: command
    };
    // @ts-expect-error ts暂时无法识别该类型
    SetCommandMap[command](creep, ...argv);
}
exports.SetNextCommand = SetNextCommand;
