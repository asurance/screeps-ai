"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repair = exports.SetCreepRepair = void 0;
const config_1 = require("../config");
/**
 * 维修前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepRepair(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepRepair = SetCreepRepair;
/**
 * 维修
 * @param creep Creep
 */
function Repair(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.energy > 0) {
            if (target.hits < target.hitsMax) {
                if (creep.pos.inRangeTo(target, 3)) {
                    const result = creep.repair(target);
                    if (result !== OK) {
                        Game.notify(`withdraw fail with code:${result}`, config_1.config.notifyInterval);
                    }
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 3 });
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
            return 2 /* RequireMoreEnergy */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}
exports.Repair = Repair;
