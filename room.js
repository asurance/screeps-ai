"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanRoomAndCreateTask = exports.CreepTask = exports.TaskQueue = void 0;
const priorityQueue_1 = require("./priorityQueue");
const task_1 = require("./task");
exports.TaskQueue = new priorityQueue_1.PriorityQueue();
exports.CreepTask = new Map();
function ScanRoomAndCreateTask(room) {
    const sources = room.find(FIND_SOURCES);
    sources.forEach(source => {
        const harvestTask = {
            publisher: source.id
        };
        exports.TaskQueue.push(harvestTask, 0);
    });
    if (room.controller) {
        const upgradeControlelrTask = {
            publisher: room.controller.id
        };
        exports.TaskQueue.push(upgradeControlelrTask, 0);
    }
    sources.forEach(source => {
        new task_1.CanHarvestTask(source);
    });
}
exports.ScanRoomAndCreateTask = ScanRoomAndCreateTask;
