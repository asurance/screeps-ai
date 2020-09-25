"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Harvest = exports.SetCreepHarvest = void 0;
const config_1 = require("../config");
/**
 * 收获前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepHarvest(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepHarvest = SetCreepHarvest;
/**
 * 收获
 * @param creep Creep
 * @return 收获结果
 */
function Harvest(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (target.energy > 0 || target.ticksToRegeneration < 100) {
            if (creep.pos.inRangeTo(target.pos, 1)) {
                if (target.energy > 0) {
                    const result = creep.harvest(target);
                    if (result !== OK) {
                        Game.notify(`harvest fail with code:${result}`, config_1.config.notifyInterval);
                    }
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
            return 3 /* TargetNeedReplace */;
        }
    }
    else {
        return 2 /* TargetLost */;
    }
}
exports.Harvest = Harvest;
