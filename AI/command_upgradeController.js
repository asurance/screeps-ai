"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateController = exports.SetCreepUpgradeController = void 0;
const config_1 = require("../config");
/**
 * 升级控制器前
 * @param creep Creep
 */
function SetCreepUpgradeController() {
    // TODO 暂时没有需要做的
}
exports.SetCreepUpgradeController = SetCreepUpgradeController;
function UpdateController(creep) {
    if (creep.store.energy > 0) {
        if (creep.pos.inRangeTo(creep.room.controller, 3)) {
            const result = creep.upgradeController(creep.room.controller);
            if (result !== OK) {
                Game.notify(`upgradeController fail with code:${result}`, config_1.config.notifyInterval);
            }
            return 0 /* OK */;
        }
        else {
            if (creep.fatigue <= 0) {
                const result = creep.moveTo(creep.room.controller, { range: 3 });
                if (result !== OK) {
                    Game.notify(`move fail with code:${result}`, config_1.config.notifyInterval);
                }
            }
            return 1 /* Moving */;
        }
    }
    else {
        return 2 /* RequireMoreEnergy */;
    }
}
exports.UpdateController = UpdateController;
