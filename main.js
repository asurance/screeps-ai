/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/baseCreep.ts":
/*!**************************!*\
  !*** ./src/baseCreep.ts ***!
  \**************************/
/*! exports provided: EnergyMap, GetRequiredEnergy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EnergyMap", function() { return EnergyMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetRequiredEnergy", function() { return GetRequiredEnergy; });
const EnergyMap = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
};
function GetRequiredEnergy(body) {
    return body.reduce((pre, cur) => {
        return pre + EnergyMap[cur];
    }, 0);
}


/***/ }),

/***/ "./src/builder.ts":
/*!************************!*\
  !*** ./src/builder.ts ***!
  \************************/
/*! exports provided: Builder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Builder", function() { return Builder; });
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
var _a;

const Builder = (_a = class Builder {
        create(spawn) {
            const name = `${Builder.type}-${Game.time}`;
            const result = spawn.spawnCreep(['work', 'carry', 'move'], name);
            if (result === OK) {
                this.creep = Game.creeps[name];
                this.creep.memory = {
                    type: "builder" /* Builder */,
                    building: false
                };
            }
            return result;
        }
        ticker() {
            const creep = this.creep;
            if (creep.memory.building) {
                if (creep.store[RESOURCE_ENERGY] === 0) {
                    creep.memory.building = false;
                }
            }
            else {
                if (creep.store.getFreeCapacity() === 0) {
                    creep.memory.building = true;
                }
            }
            if (creep.memory.building) {
                const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    creep.say('建造中');
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                const sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
                creep.say('采矿中');
                return true;
            }
        }
    },
    _a.type = "builder" /* Builder */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    _a);


/***/ }),

/***/ "./src/carrier.ts":
/*!************************!*\
  !*** ./src/carrier.ts ***!
  \************************/
/*! exports provided: Carrier */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Carrier", function() { return Carrier; });
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
var _a;

const Carrier = (_a = class Carrier {
        create(spawn) {
            const name = `${Carrier.type}-${Game.time}`;
            const result = spawn.spawnCreep(['work', 'move'], name);
            if (result === OK) {
                this.creep = Game.creeps[name];
                this.creep.memory = {
                    type: "carrier" /* Carrier */,
                    pickup: true,
                    targetId: null
                };
            }
            return result;
        }
        ticker() {
            const memory = this.creep.memory;
            if (memory.pickup) {
                if (this.creep.store.energy < this.creep.store.getCapacity('energy')) {
                    if (memory.targetId === null) {
                        const target = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                        if (target) {
                            memory.targetId = target.id;
                        }
                    }
                    if (memory.targetId !== null) {
                        this.creep.say('寻找资源');
                        const target = Game.getObjectById(memory.targetId);
                        if (this.creep.pickup(target) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(target);
                        }
                    }
                    else {
                        memory.pickup = false;
                        memory.targetId = null;
                    }
                }
                else {
                    memory.pickup = false;
                    memory.targetId = null;
                }
            }
            else {
                if (this.creep.store.energy > 0) {
                    if (memory.targetId === null) {
                        const target = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                        if (target) {
                            memory.targetId = target.id;
                        }
                    }
                    if (memory.targetId !== null) {
                        this.creep.say('放置资源');
                        const target = Game.getObjectById(memory.targetId);
                        if (this.creep.transfer(target, 'energy') === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(target);
                        }
                    }
                    else {
                        memory.pickup = true;
                        memory.targetId = null;
                    }
                }
                else {
                    memory.pickup = true;
                    memory.targetId = null;
                }
            }
            return true;
        }
    },
    _a.type = "carrier" /* Carrier */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['carry', 'move']),
    _a);


/***/ }),

/***/ "./src/harvester.ts":
/*!**************************!*\
  !*** ./src/harvester.ts ***!
  \**************************/
/*! exports provided: Harvester */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Harvester", function() { return Harvester; });
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
var _a;

const Harvester = (_a = class Harvester {
        create(spawn) {
            const name = `${Harvester.type}-${Game.time}`;
            const result = spawn.spawnCreep(['work', 'carry', 'move'], name);
            if (result === OK) {
                this.creep = Game.creeps[name];
                this.creep.memory = {
                    type: "harvester" /* Harvester */,
                };
            }
            return result;
        }
        ticker() {
            if (this.creep.store.getFreeCapacity() > 0) {
                const source = this.creep.room.find(FIND_SOURCES);
                if (this.creep.harvest(source[0]) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source[0]);
                }
                this.creep.say('采矿中');
                return true;
            }
            else {
                const targets = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_EXTENSION
                            || structure.structureType === STRUCTURE_SPAWN
                            || structure.structureType === STRUCTURE_TOWER
                                && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(targets[0]);
                    }
                    this.creep.say('运输中');
                    return true;
                }
                else {
                    this.creep.say('闲置中');
                    return false;
                }
            }
        }
    },
    _a.type = "harvester" /* Harvester */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    _a);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./builder */ "./src/builder.ts");
/* harmony import */ var _carrier__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./carrier */ "./src/carrier.ts");
/* harmony import */ var _harvester__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./harvester */ "./src/harvester.ts");
/* harmony import */ var _upgrader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./upgrader */ "./src/upgrader.ts");
/* harmony import */ var _walker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./walker */ "./src/walker.ts");
/* harmony import */ var _worker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./worker */ "./src/worker.ts");






for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key];
    }
}
const creepCtorMap = {
    worker: _worker__WEBPACK_IMPORTED_MODULE_5__["Worker"],
    walker: _walker__WEBPACK_IMPORTED_MODULE_4__["Walker"],
    carrier: _carrier__WEBPACK_IMPORTED_MODULE_1__["Carrier"],
    harvester: _harvester__WEBPACK_IMPORTED_MODULE_2__["Harvester"],
    upgrader: _upgrader__WEBPACK_IMPORTED_MODULE_3__["Upgrader"],
    builder: _builder__WEBPACK_IMPORTED_MODULE_0__["Builder"],
};
const creepMap = new Map();
for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    const type = creep.memory.type;
    const handler = new creepCtorMap[type]();
    handler.creep = creep;
    if (creepMap.has(type)) {
        creepMap.get(type).push(handler);
    }
    else {
        creepMap.set(type, [handler]);
    }
}
let spawning = null;
const list = ["harvester" /* Harvester */, "upgrader" /* Upgrader */, "builder" /* Builder */];
for (let i = 0; i < list.length; i++) {
    const l = creepMap.get(list[i]);
    if (!l) {
        spawning = list[i];
        break;
    }
}
if (spawning === null) {
    creepMap.forEach((creeps, type) => {
        let flag = true;
        for (let i = 0; i < creeps.length; i++) {
            flag = creeps[i].ticker() && flag;
        }
        if (!flag) {
            const index = list.indexOf(type);
            if (index >= 0) {
                list.splice(index, 1);
            }
        }
        spawning = list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
    });
}
else {
    creepMap.forEach(creeps => creeps.forEach(creep => creep.ticker()));
}
for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    if (spawning !== null) {
        const ctor = creepCtorMap[spawning];
        if (spawn.room.energyAvailable >= ctor.minEnergy) {
            const creep = new ctor();
            const reuslt = creep.create(spawn, spawn.room.energyAvailable);
            if (reuslt !== OK) {
                console.log(reuslt);
            }
        }
    }
}


/***/ }),

/***/ "./src/upgrader.ts":
/*!*************************!*\
  !*** ./src/upgrader.ts ***!
  \*************************/
/*! exports provided: Upgrader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Upgrader", function() { return Upgrader; });
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
var _a;

const Upgrader = (_a = class Upgrader {
        create(spawn) {
            const name = `${Upgrader.type}-${Game.time}`;
            const result = spawn.spawnCreep(['work', 'carry', 'move'], name);
            if (result === OK) {
                this.creep = Game.creeps[name];
                this.creep.memory = {
                    type: "upgrader" /* Upgrader */,
                    upgrading: false,
                };
            }
            return result;
        }
        ticker() {
            if (this.creep.memory.upgrading && this.creep.store[RESOURCE_ENERGY] === 0) {
                if (this.creep.store[RESOURCE_ENERGY] === 0) {
                    this.creep.memory.upgrading = false;
                }
            }
            else {
                if (this.creep.store.getFreeCapacity() === 0) {
                    this.creep.memory.upgrading = true;
                }
            }
            if (this.creep.memory.upgrading) {
                if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(this.creep.room.controller);
                }
                this.creep.say('升级中');
            }
            else {
                const sources = this.creep.room.find(FIND_SOURCES);
                if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(sources[0]);
                }
                this.creep.say('采矿中');
            }
            return true;
        }
    },
    _a.type = "upgrader" /* Upgrader */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    _a);


/***/ }),

/***/ "./src/walker.ts":
/*!***********************!*\
  !*** ./src/walker.ts ***!
  \***********************/
/*! exports provided: Walker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Walker", function() { return Walker; });
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
var _a;

const Walker = (_a = class Walker {
        create(spawn) {
            const name = `${Walker.type}-${Game.time}`;
            const result = spawn.spawnCreep(['move'], `${Walker.type}-${Game.time}`);
            if (result === OK) {
                this.creep = Game.creeps[name];
                this.creep.memory = {
                    type: "walker" /* Walker */,
                    direction: 1 + Math.floor(Math.random() * 8),
                    restTick: 60,
                };
            }
            return result;
        }
        ticker() {
            const memory = this.creep.memory;
            memory.restTick--;
            if (memory.restTick < 0) {
                memory.restTick = 60;
                memory.direction = 1 + Math.floor(Math.random() * 8);
            }
            this.creep.move(memory.direction);
            return true;
        }
    },
    _a.type = "walker" /* Walker */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['move']),
    _a);


/***/ }),

/***/ "./src/worker.ts":
/*!***********************!*\
  !*** ./src/worker.ts ***!
  \***********************/
/*! exports provided: Worker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Worker", function() { return Worker; });
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
var _a;

const Worker = (_a = class Worker {
        create(spawn) {
            const name = `${Worker.type}-${Game.time}`;
            const result = spawn.spawnCreep(['work', 'move'], name);
            if (result === OK) {
                this.creep = Game.creeps[name];
                this.creep.memory = {
                    type: "worker" /* Worker */,
                    targetId: null,
                };
            }
            return result;
        }
        ticker() {
            const memory = this.creep.memory;
            if (memory.targetId === null) {
                const target = this.creep.pos.findClosestByPath(FIND_SOURCES);
                if (target) {
                    memory.targetId = target.id;
                }
            }
            if (memory.targetId !== null) {
                this.creep.say('采矿中');
                const target = Game.getObjectById(memory.targetId);
                if (this.creep.harvest(target) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
            }
            return true;
        }
    },
    _a.type = "worker" /* Worker */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'move']),
    _a);


/***/ })

/******/ });
//# sourceMappingURL=main.js.map