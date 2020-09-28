"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnCreepTask = exports.UpgradeControllerTask = exports.HarvestTask = exports.MoveTask = exports.CanHarvestTask = void 0;
const timer_1 = require("./timer");
const obstacles = new Set(OBSTACLE_OBJECT_TYPES);
// interface Task {
//     onFinish
// }
class CanHarvestTask {
    constructor(source) {
        this.sourceId = source.id;
        const top = Math.max(0, source.pos.y - 1);
        const bottom = Math.min(49, source.pos.y + 1);
        const left = Math.max(0, source.pos.x - 1);
        const right = Math.min(49, source.pos.x + 1);
        const structure = source.room.lookForAtArea('structure', top, left, bottom, right, true)
            .filter(s => obstacles.has(s.structure.structureType));
        const terrain = source.room.lookForAtArea('terrain', top, left, bottom, right, true)
            .filter(t => t.terrain !== 'wall' && structure.every(s => s.x !== t.x && s.y !== t.y))
            .sort((a, b) => a.terrain === b.terrain ? 0 : a.terrain === 'plain' ? -1 : 1);
        this.targetPos = terrain.map(t => new RoomPosition(t.x, t.y, source.room.name));
    }
}
exports.CanHarvestTask = CanHarvestTask;
class MoveTask {
    constructor(creep, target, range) {
        this.target = target;
        this.range = range;
    }
    execute(creep) {
        var _a;
        if (creep.pos.inRangeTo(this.target, this.range)) {
            (_a = this.onFinish) === null || _a === void 0 ? void 0 : _a.call(this);
        }
        else {
            creep.moveTo(this.target, { range: this.range });
        }
    }
}
exports.MoveTask = MoveTask;
class HarvestTask {
    constructor(source) {
        this.sourceId = source.id;
    }
    execute(creep) {
        var _a, _b;
        const source = Game.getObjectById(this.sourceId);
        if (source) {
            if (source.energy > 0) {
                creep.harvest(source);
            }
            else {
                (_a = this.onFinish) === null || _a === void 0 ? void 0 : _a.call(this);
            }
        }
        else {
            (_b = this.onError) === null || _b === void 0 ? void 0 : _b.call(this);
        }
    }
}
exports.HarvestTask = HarvestTask;
class UpgradeControllerTask {
    constructor(creep) {
        this.creepId = creep.id;
    }
    execute(creep) {
        var _a, _b;
        if (creep.room.controller) {
            if (creep.store[RESOURCE_ENERGY] > 0) {
                creep.upgradeController(creep.room.controller);
            }
            else {
                (_a = this.onFinish) === null || _a === void 0 ? void 0 : _a.call(this);
            }
        }
        else {
            (_b = this.onError) === null || _b === void 0 ? void 0 : _b.call(this);
        }
    }
}
exports.UpgradeControllerTask = UpgradeControllerTask;
class SpawnCreepTask {
    constructor(spawn, bodypart) {
        var _a;
        this.onSpawnFinish = () => {
            var _a;
            (_a = this.onFinish) === null || _a === void 0 ? void 0 : _a.call(this, this.creepname);
        };
        this.creepname = `${spawn.name}-${Game.time}`;
        const result = spawn.spawnCreep(bodypart, this.creepname);
        if (result === OK) {
            timer_1.setTimeout(this.onSpawnFinish, bodypart.length * CREEP_SPAWN_TIME);
        }
        else {
            (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, result);
        }
    }
}
exports.SpawnCreepTask = SpawnCreepTask;
