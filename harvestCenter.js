"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.harvestCenter = exports.HarvestCenter = void 0;
class HarvestCenter {
    constructor() {
        this.tasks = [];
    }
    assignTask(task) {
        this.tasks.push(task);
    }
}
exports.HarvestCenter = HarvestCenter;
exports.harvestCenter = new HarvestCenter();
