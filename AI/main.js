"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = exports.creepInfo = void 0;
require("./patch");
const harvester_1 = require("./strategy/harvester");
const harvest_1 = require("./command/harvest");
const config_1 = require("./config");
const util_1 = require("./util");
const upgradeController_1 = require("./command/upgradeController");
const transfer_1 = require("./command/transfer");
const pickup_1 = require("./command/pickup");
const transferer_1 = require("./strategy/transferer");
const worker_1 = require("./strategy/worker");
const withdraw_1 = require("./command/withdraw");
const build_1 = require("./command/build");
const repair_1 = require("./command/repair");
/**
 * creep信息
 */
exports.creepInfo = CreateCreepInfo();
function CreateCreepInfo() {
    var _a, _b;
    const creepInfo = new Map();
    // 数据预处理
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        let map = creepInfo.get(creep.memory.strategy.type);
        if (!map) {
            map = new Map();
            creepInfo.set(creep.memory.strategy.type, map);
        }
        const key = (_b = (_a = creep.memory.cmd) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : null;
        const list = map.get(key);
        if (list) {
            list.push(creep);
        }
        else {
            map.set(key, [creep]);
        }
    }
    return creepInfo;
}
function loop() {
    // 删除过期数据
    for (const key in Memory.creeps) {
        if (!(key in Game.creeps)) {
            delete Memory.creeps[key];
        }
    }
    exports.creepInfo = CreateCreepInfo();
    // 数据
    const strategyMap = {
        harvester: harvester_1.Harvester,
        transferer: transferer_1.Transferer,
        worker: worker_1.Worker,
    };
    const commandMap = {
        harvest: harvest_1.Harvest,
        updateController: upgradeController_1.UpdateController,
        transfer: transfer_1.Transfer,
        pickup: pickup_1.Pickup,
        withdraw: withdraw_1.Withdraw,
        build: build_1.Build,
        repair: repair_1.Repair,
    };
    const spawn = Game.spawns['Home'];
    // 塔设置
    const towers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TOWER
            && structure.my
    });
    towers.forEach(tower => {
        const hostTile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostTile) {
            hostTile.attack(hostTile);
        }
    });
    // creep操作
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (!creep.spawning) {
            const strategyType = creep.memory.strategy.type;
            if (creep.memory.cmd) {
                const commandType = creep.memory.cmd.type;
                // @ts-expect-error ts暂时无法识别该类型
                strategyMap[strategyType].callbackMap[commandType](creep, commandMap[commandType](creep));
            }
            else {
                strategyMap[strategyType].start(creep);
            }
        }
    }
    // 生成新creep
    if (!spawn.spawning) {
        let spawing = null;
        let list = ["harvester" /* Harvester */, "transferer" /* Transferer */, "worker" /* Worker */];
        for (let i = 0; i < list.length; i++) {
            const map = exports.creepInfo.get(list[i]);
            if (map) {
                let sum = 0;
                map.forEach(v => sum += v.length);
                if (sum >= config_1.config[list[i]]) {
                    list.splice(i, 1);
                    i--;
                }
            }
            else {
                spawing = list[i];
                break;
            }
        }
        if (spawing) {
            if (spawn.room.energyAvailable < strategyMap[spawing].minEnergy) {
                spawing = null;
            }
        }
        else {
            list = list.filter(s => spawn.room.energyAvailable >= strategyMap[s].minEnergy);
            spawing = util_1.RandomObjectInList(list);
        }
        if (spawing) {
            const name = `${spawn.name}-${spawing}-${Game.time}`;
            const result = spawn.spawnCreep(strategyMap[spawing].create(spawn.room.energyAvailable), name);
            if (result === OK) {
                const creep = Game.creeps[name];
                creep.memory.strategy = {
                    type: spawing
                };
                strategyMap[spawing].initStrategy(creep);
            }
            else {
                Game.notify(`spawn creep fail with code:${result}`, config_1.config.notifyInterval);
            }
        }
    }
}
exports.loop = loop;
