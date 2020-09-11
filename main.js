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
        static serialize() {
            return this.id;
        }
        static deserialize(data) {
            this.id = data;
        }
        create(spawn) {
            const name = `${Carrier.type}-${Carrier.id}`;
            const result = spawn.spawnCreep(['work', 'move'], `${Carrier.type}-${Carrier.id}`);
            if (result === OK) {
                Carrier.id++;
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
                if (this.creep.store.getFreeCapacity('energy') > 0) {
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
                if (this.creep.store.getUsedCapacity('energy') > 0) {
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
        }
    },
    _a.id = 0,
    _a.type = "carrier" /* Carrier */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['carry', 'move']),
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
/* harmony import */ var _carrier__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./carrier */ "./src/carrier.ts");
/* harmony import */ var _walker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./walker */ "./src/walker.ts");
/* harmony import */ var _worker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./worker */ "./src/worker.ts");



for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key];
    }
}
const creepCtorMap = {
    worker: _worker__WEBPACK_IMPORTED_MODULE_2__["Worker"],
    walker: _walker__WEBPACK_IMPORTED_MODULE_1__["Walker"],
    carrier: _carrier__WEBPACK_IMPORTED_MODULE_0__["Carrier"],
};
if (!Memory.ctors) {
    Memory.ctors = {
        walker: 0,
        carrier: 0,
        worker: 0,
    };
}
for (const key in creepCtorMap) {
    const ctor = creepCtorMap[key];
    ctor.deserialize(Memory.ctors[key]);
}
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
for (const spawnName in Game.spawns) {
    const span = Game.spawns[spawnName];
    const workerList = creepMap.get("worker" /* Worker */);
    if (!workerList) {
        if (!span.spawning && span.room.energyAvailable >= _worker__WEBPACK_IMPORTED_MODULE_2__["Worker"].minEnergy) {
            const worker = new _worker__WEBPACK_IMPORTED_MODULE_2__["Worker"]();
            const result = worker.create(span, span.room.energyAvailable);
            if (result !== OK) {
                console.log(result);
            }
            else {
                continue;
            }
        }
    }
    const carrierList = creepMap.get("carrier" /* Carrier */);
    if (!carrierList) {
        if (!span.spawning && span.room.energyAvailable >= _carrier__WEBPACK_IMPORTED_MODULE_0__["Carrier"].minEnergy) {
            const carrier = new _carrier__WEBPACK_IMPORTED_MODULE_0__["Carrier"]();
            const result = carrier.create(span, span.room.energyAvailable);
            if (result !== OK) {
                console.log(result);
            }
            else {
                continue;
            }
        }
    }
    const walkerList = creepMap.get("walker" /* Walker */);
    if (!walkerList) {
        if (!span.spawning && span.room.energyAvailable >= _walker__WEBPACK_IMPORTED_MODULE_1__["Walker"].minEnergy) {
            const walker = new _walker__WEBPACK_IMPORTED_MODULE_1__["Walker"]();
            const result = walker.create(span, span.room.energyAvailable);
            if (result !== OK) {
                console.log(result);
            }
            else {
                continue;
            }
        }
    }
}
creepMap.forEach(creeps => creeps.forEach(creep => creep.ticker()));
for (const key in creepCtorMap) {
    const ctor = creepCtorMap[key];
    Memory.ctors[key] = ctor.serialize();
}


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
        static serialize() {
            return this.id;
        }
        static deserialize(data) {
            this.id = data;
        }
        create(spawn) {
            const name = `${Walker.type}-${Walker.id}`;
            const result = spawn.spawnCreep(['move'], `${Walker.type}-${Walker.id}`);
            if (result === OK) {
                Walker.id++;
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
        }
    },
    _a.id = 0,
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
        static serialize() {
            return this.id;
        }
        static deserialize(data) {
            this.id = data;
        }
        create(spawn) {
            const name = `${Worker.type}-${Worker.id}`;
            const result = spawn.spawnCreep(['work', 'move'], `${Worker.type}-${Worker.id}`);
            if (result === OK) {
                Worker.id++;
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
        }
    },
    _a.id = 0,
    _a.type = "worker" /* Worker */,
    _a.minEnergy = Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'move']),
    _a);


/***/ })

/******/ });
//# sourceMappingURL=main.js.map