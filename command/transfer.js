"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = exports.SetCreepTransfer = void 0;
const config_1 = require("../config");
/**
 * 转移前
 * @param creep Creep
 * @param target 转移目标
 */
function SetCreepTransfer(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepTransfer = SetCreepTransfer;
/**
 * 转移
 * @param creep Creep
 */
function Transfer(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.energy > 0) {
            let hasRest = false;
            switch (target.structureType) {
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_TOWER:
                    hasRest = target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    break;
                case STRUCTURE_CONTAINER:
                case STRUCTURE_STORAGE:
                    hasRest = target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    break;
            }
            if (hasRest) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.transfer(target, RESOURCE_ENERGY);
                    if (result !== OK) {
                        Game.notify(`transfer fail with code:${result}`, config_1.config.notifyInterval);
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
            return 2 /* RequireMoreEnergy */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}
exports.Transfer = Transfer;
