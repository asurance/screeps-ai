"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Harvester = void 0;
const util_1 = require("./util");
class Harvester {
    constructor(creep, task) {
        this.creeep = creep.name;
        this.task = task;
    }
    tick() {
        if (this.creeep in Game.creeps) {
            const creep = Game.creeps[this.creeep];
            if (creep.store.energy > 0) {
                const structures = creep.room.lookForAt('structure', this.task.containerX, this.task.containerY);
                for (const structure of structures) {
                    if (structure.structureType === STRUCTURE_CONTAINER) {
                        const s = structure;
                        if (s.hits <= CONTAINER_DECAY) {
                            creep.repair(s);
                        }
                        else {
                            if (s.store.getFreeCapacity() > 0) {
                                creep.transfer(s, RESOURCE_ENERGY);
                            }
                            else if (s.hits < s.hitsMax) {
                                creep.repair(s);
                            }
                        }
                        break;
                    }
                }
            }
            else {
                const source = Game.getObjectById(this.task.sourceId);
                if (source) {
                    util_1.MoveToTarget(creep, source.pos, 1, () => {
                        creep.harvest(source);
                    });
                }
            }
        }
    }
}
exports.Harvester = Harvester;
