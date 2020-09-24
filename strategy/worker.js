"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const command_1 = require("../command/command");
const moveCache_1 = require("../moveCache");
const util_1 = require("../util");
const global_1 = require("../global");
/**
 * 采集者策略
 */
exports.Worker = {
    minEnergy: util_1.GetRequiredEnergy([MOVE, WORK, CARRY]),
    create(maxEnergy) {
        const count = Math.floor(maxEnergy / (BODYPART_COST.work + BODYPART_COST.move + BODYPART_COST.carry));
        const body = [];
        for (let i = 0; i < count; i++) {
            body.push(MOVE, WORK, CARRY);
        }
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = moveCache_1.initMoveCache(creep);
    },
    start(creep) {
        FindWithdrawTarget(creep);
    },
    callbackMap: {
        ["withdraw" /* Withdraw */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 3 /* TargetLost */:
                case 4 /* TargetNeedReplace */:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep);
                    }
                    else {
                        FindWithdrawTarget(creep);
                    }
                    break;
                case 2 /* Full */:
                    FindNextWork(creep);
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindRandomWithdrawTarget(creep);
                    }
            }
        },
        ["updateController" /* UpgradeController */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindNextWork(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindWithdrawTarget(creep);
                    break;
            }
        },
        ["build" /* Build */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 4 /* TargetNeedReplace */:
                case 3 /* TargetLost */:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep);
                    }
                    else {
                        FindWithdrawTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindNextWork(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindWithdrawTarget(creep);
                    break;
            }
        },
        ["repair" /* Repair */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 4 /* TargetNeedReplace */:
                case 3 /* TargetLost */:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep);
                    }
                    else {
                        FindWithdrawTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindNextWork(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindWithdrawTarget(creep);
                    break;
            }
        },
    },
};
function FindWithdrawTarget(creep) {
    let target = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (tombstone) => tombstone.store.energy > 0 });
    if (target === null) {
        target = creep.pos.findClosestByPath(FIND_RUINS, { filter: (ruin) => ruin.store.energy > 0 });
    }
    if (target === null) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => ((structure.structureType === STRUCTURE_CONTAINER)
                || (structure.structureType === STRUCTURE_STORAGE && structure.my))
                && structure.store.energy > 0
        });
    }
    if (target) {
        command_1.SetNextCommand("withdraw" /* Withdraw */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindRandomWithdrawTarget(creep) {
    const targets = creep.room.find(FIND_TOMBSTONES, { filter: (tombstone) => tombstone.store.energy > 0 });
    targets.push(...creep.room.find(FIND_RUINS, { filter: (ruin) => ruin.store.energy > 0 }));
    targets.push(...creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => ((structure.structureType === STRUCTURE_CONTAINER)
            || (structure.structureType === STRUCTURE_STORAGE && structure.my))
            && structure.store.energy > 0
    }));
    const target = util_1.RandomObjectInList(targets);
    if (target) {
        command_1.SetNextCommand("withdraw" /* Withdraw */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindBuildTarget(creep) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: (constructionSite) => constructionSite.progress < constructionSite.progressTotal
    });
    if (targets.length > 0) {
        const target = targets.reduce((pre, cur) => {
            if (pre.progressTotal < cur.progressTotal / 10) {
                return pre;
            }
            else if (cur.progressTotal < pre.progressTotal / 10) {
                return cur;
            }
            else {
                return pre.progress / pre.progressTotal > cur.progress / cur.progressTotal ?
                    pre : cur;
            }
        });
        command_1.SetNextCommand("build" /* Build */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindRepairTarget(creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure => structure.hits < structure.hitsMax)
    });
    if (targets.length > 0) {
        const target = targets.reduce((pre, cur) => {
            if (pre.hits < 1000 && cur.hits < 1000) {
                return pre < cur ? pre : cur;
            }
            else {
                if (pre.hits < 1000) {
                    return pre;
                }
                if (cur.hits < 1000) {
                    return cur;
                }
                return pre.hits / pre.hitsMax < cur.hits / cur.hitsMax ?
                    pre : cur;
            }
        });
        command_1.SetNextCommand("repair" /* Repair */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindUpgradeTarget(creep) {
    if (creep.room.controller) {
        command_1.SetNextCommand("updateController" /* UpgradeController */, creep);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
const cmds = ["updateController" /* UpgradeController */, "build" /* Build */, "repair" /* Repair */];
const fns = [FindUpgradeTarget, FindBuildTarget, FindRepairTarget];
function FindNextWork(creep) {
    const counts = [0, 0, 0];
    const rest = [];
    const workers = global_1.creepInfo.get("worker" /* Worker */);
    if (workers) {
        cmds.forEach((cmd, index) => {
            const l = workers.get(cmd);
            if (l) {
                counts[index] = l.length;
            }
        });
    }
    const index = cmds.indexOf(creep.memory.cmd.type);
    if (index >= 0) {
        counts[index]--;
    }
    for (let i = 0; i < counts.length; i++) {
        if (counts[i] === 0) {
            const result = fns[i](creep);
            if (result) {
                return true;
            }
        }
        else {
            rest.push(i);
        }
    }
    let id = util_1.RandomObjectInList(rest);
    while (id !== null) {
        const result = fns[id](creep);
        if (result) {
            return true;
        }
        const index = rest.indexOf(id);
        rest.splice(index, 1);
        id = util_1.RandomObjectInList(rest);
    }
    return false;
}
