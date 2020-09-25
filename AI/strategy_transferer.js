"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transferer = void 0;
const command_1 = require("../command/command");
const moveCache_1 = require("../moveCache");
const util_1 = require("../util");
/**
 * 运输者
 */
exports.Transferer = {
    minEnergy: util_1.GetRequiredEnergy([CARRY, MOVE]),
    create(maxEnergy) {
        let rest = maxEnergy - this.minEnergy;
        const body = [CARRY, MOVE];
        if (rest >= BODYPART_COST.carry) {
            body.unshift(CARRY);
            rest -= BODYPART_COST.carry;
        }
        const count = Math.floor(rest / (BODYPART_COST.carry * 2 + BODYPART_COST.move));
        for (let i = 0; i < count; i++) {
            body.push(CARRY, CARRY, MOVE);
        }
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = moveCache_1.initMoveCache(creep);
    },
    start(creep) {
        FindPickupTarget(creep);
    },
    callbackMap: {
        ["pickup" /* Pickup */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 3 /* TargetLost */:
                case 4 /* TargetNeedReplace */:
                    if (!FindPickupTarget(creep) && creep.store.energy > 0) {
                        FindTransferTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindPickupTarget(creep);
                    }
                    break;
                case 2 /* Full */:
                    FindTransferTarget(creep);
                    break;
            }
        },
        ["transfer" /* Transfer */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 3 /* TargetLost */:
                case 4 /* TargetNeedReplace */:
                    if (!FindTransferTarget(creep)) {
                        FindPickupTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindTransferTarget(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindPickupTarget(creep);
                    break;
            }
        },
    }
};
/**
 * 找到下一个捡起目标
 * @param creep creep
 */
function FindPickupTarget(creep) {
    const target = util_1.RandomObjectInList(creep.room.find(FIND_DROPPED_RESOURCES));
    if (target) {
        command_1.SetNextCommand("pickup" /* Pickup */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
/**
 * 找到下一个转移目标
 * @param creep creep
 */
function FindTransferTarget(creep) {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure => {
            switch (structure.structureType) {
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_TOWER:
                    return structure.my && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                case STRUCTURE_STORAGE:
                    return structure.my && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                case STRUCTURE_CONTAINER:
                    return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            return false;
        }),
        range: 1,
    });
    if (target) {
        command_1.SetNextCommand("transfer" /* Transfer */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
