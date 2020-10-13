"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestTask = void 0;
const global_1 = require("./global");
const util_1 = require("./util");
class HarvestTask {
    constructor(source) {
        this.activeCreeps = [];
        this.containerX = 0;
        this.containerY = 0;
        this.container = null;
        this.containerSite = null;
        this.sourceId = source.id;
        this.priority = 100;
        const structure = util_1.LookForInRange('structure', source, 1)
            .filter(s => global_1.obstacles.has(s.structure.structureType));
        const terrain = util_1.LookForInRange('terrain', source, 1)
            .filter(t => t.terrain !== 'wall'
            && structure.every(s => s.x !== t.x && s.y !== t.y));
        source.room.createConstructionSite(terrain[0].x, terrain[0].y, STRUCTURE_CONTAINER);
        const site = source.room.lookForAt('constructionSite', terrain[0].x, terrain[0].y);
        this.containerSite = site[0].id;
        this.maxCount = terrain.length;
    }
    query(creep) {
        throw new Error('Method not implemented.');
    }
    assign(creep) {
        throw new Error('Method not implemented.');
    }
}
exports.HarvestTask = HarvestTask;
