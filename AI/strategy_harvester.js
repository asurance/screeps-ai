"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Harvester = void 0;
const command_1 = require("../command/command");
const moveCache_1 = require("../moveCache");
const util_1 = require("../util");
/**
 * 采集者策略
 */
exports.Harvester = {
    minEnergy: util_1.GetRequiredEnergy([MOVE, WORK]),
    create(maxEnergy) {
        const count = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work);
        const body = [MOVE, WORK];
        body.splice(0, 0, ...new Array(count).fill(WORK));
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = moveCache_1.initMoveCache(creep);
    },
    start(creep) {
        FindNextTarget(creep);
    },
    callbackMap: {
        ["harvest" /* Harvest */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 2 /* TargetLost */:
                case 3 /* TargetNeedReplace */:
                    FindNextTarget(creep);
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindNextTarget(creep);
                    }
                    break;
            }
        }
    },
};
/**
 * 找到下一个采集目标
 * @param creep creep
 * @return 是否成功
 */
function FindNextTarget(creep) {
    const roomInfos = util_1.GetRoomInfo(creep.room);
    const sourceId = util_1.RandomObjectInList(roomInfos.sourceInfo);
    if (sourceId) {
        const target = Game.getObjectById(sourceId);
        if (target) {
            command_1.SetNextCommand("harvest" /* Harvest */, creep, target);
            return true;
        }
    }
    creep.say('闲置中');
    return false;
}
