"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdraw = exports.SetCreepWithdraw = void 0;
const config_1 = require("../config");
/**
 * 取回前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepWithdraw(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepWithdraw = SetCreepWithdraw;
/**
 * 取回
 * @param creep Creep
 */
function Withdraw(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (target.store.energy > 0) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.withdraw(target, RESOURCE_ENERGY);
                    if (result !== OK) {
                        Game.notify(`withdraw fail with code:${result}`, config_1.config.notifyInterval);
                    }
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 1 });
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, config_1.config.notifyInterval);
                        }
                    }
                    return 1 /* Moving */;
                }
            }
            else {
                return 4 /* TargetNeedReplace */;
            }
        }
        else {
            return 2 /* Full */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}
exports.Withdraw = Withdraw;
