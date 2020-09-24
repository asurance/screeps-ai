"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creepInfo = void 0;
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
