"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Build = exports.SetCreepBuild = void 0;
const config_1 = require("../config");
/**
 * 建造前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepBuild(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepBuild = SetCreepBuild;
/**
 * 建造
 * @param creep Creep
 */
function Build(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.energy > 0) {
            if (target.progress < target.progressTotal) {
                if (creep.pos.inRangeTo(target, 3)) {
                    const result = creep.build(target);
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
exports.Build = Build;
