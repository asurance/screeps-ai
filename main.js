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

/***/ "./src/build.ts":
/*!**********************!*\
  !*** ./src/build.ts ***!
  \**********************/
/*! exports provided: Build */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Build", function() { return Build; });
function Build(creep) {
    let target = null;
    if (creep.memory.buildId) {
        target = Game.getObjectById(creep.memory.buildId);
    }
    if (target === null) {
        const source = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if (source.length > 0) {
            target = source.reduce((pre, cur) => {
                if ((pre.progress + 1) / pre.progressTotal < (cur.progress + 1) / cur.progressTotal) {
                    return cur;
                }
                else {
                    return pre;
                }
            });
            creep.memory.buildId = target.id;
        }
    }
    if (target) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.say('建造中');
            creep.moveTo(target);
            return 0;
        }
        else {
            return -2;
        }
    }
    else {
        creep.say('闲置中');
        return 10;
    }
}


/***/ }),

/***/ "./src/builderController.ts":
/*!**********************************!*\
  !*** ./src/builderController.ts ***!
  \**********************************/
/*! exports provided: BuilderController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BuilderController", function() { return BuilderController; });
/* harmony import */ var _creepController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creepController */ "./src/creepController.ts");
/* harmony import */ var _build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./build */ "./src/build.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _withdraw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./withdraw */ "./src/withdraw.ts");




const BuilderController = {
    type: "builder" /* Builder */,
    minEnergy: Object(_creepController__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['work', 'carry', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.carry);
        if (maxCount > 0) {
            const count = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomInt"])(maxCount + 1);
            if (count > 0) {
                body.splice(1, 0, ...new Array(count).fill('carry'));
            }
        }
        return spawn.spawnCreep(body, name);
    },
    ticker(creep) {
        var _a;
        let building = (_a = creep.memory.building) !== null && _a !== void 0 ? _a : false;
        if (building) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                building = false;
                delete creep.memory.buildId;
            }
        }
        else {
            if (creep.store.getFreeCapacity() === 0) {
                building = true;
                delete creep.memory.withdrawId;
            }
        }
        if (building) {
            creep.memory.building = true;
        }
        else {
            delete creep.memory.building;
        }
        if (building) {
            return Object(_build__WEBPACK_IMPORTED_MODULE_1__["Build"])(creep);
        }
        else {
            return Object(_withdraw__WEBPACK_IMPORTED_MODULE_3__["Withdraw"])(creep);
        }
    },
};


/***/ }),

/***/ "./src/creepController.ts":
/*!********************************!*\
  !*** ./src/creepController.ts ***!
  \********************************/
/*! exports provided: GetRequiredEnergy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetRequiredEnergy", function() { return GetRequiredEnergy; });
function GetRequiredEnergy(body) {
    return body.reduce((pre, cur) => {
        return pre + BODYPART_COST[cur];
    }, 0);
}


/***/ }),

/***/ "./src/harvest.ts":
/*!************************!*\
  !*** ./src/harvest.ts ***!
  \************************/
/*! exports provided: Harvest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Harvest", function() { return Harvest; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

function Harvest(creep) {
    let target = null;
    if (creep.memory.harvestId) {
        target = Game.getObjectById(creep.memory.harvestId);
    }
    if (target === null) {
        const source = creep.room.find(FIND_SOURCES);
        target = Object(_util__WEBPACK_IMPORTED_MODULE_0__["RandomObjectInList"])(source);
        if (target) {
            creep.memory.harvestId = target.id;
        }
    }
    if (target) {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.say('收获中');
            creep.moveTo(target);
            return 2;
        }
        else {
            return -2;
        }
    }
    else {
        creep.say('闲置中');
        return 10;
    }
}


/***/ }),

/***/ "./src/harvesterController.ts":
/*!************************************!*\
  !*** ./src/harvesterController.ts ***!
  \************************************/
/*! exports provided: HarvesterController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HarvesterController", function() { return HarvesterController; });
/* harmony import */ var _creepController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creepController */ "./src/creepController.ts");
/* harmony import */ var _harvest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./harvest */ "./src/harvest.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



const HarvesterController = {
    type: "harvester" /* Harvester */,
    minEnergy: Object(_creepController__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['work', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work);
        if (maxCount > 0) {
            const count = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomInt"])(maxCount + 1);
            if (count > 0) {
                body.splice(1, 0, ...new Array(count).fill('work'));
            }
        }
        return spawn.spawnCreep(body, name);
    },
    ticker(creep) {
        return Object(_harvest__WEBPACK_IMPORTED_MODULE_1__["Harvest"])(creep);
    },
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _harvesterController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./harvesterController */ "./src/harvesterController.ts");
/* harmony import */ var _upgraderController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./upgraderController */ "./src/upgraderController.ts");
/* harmony import */ var _builderController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./builderController */ "./src/builderController.ts");
/* harmony import */ var _repairerController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./repairerController */ "./src/repairerController.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./patch */ "./src/patch.ts");
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_patch__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _transferController__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transferController */ "./src/transferController.ts");







const creepControllerMap = {
    harvester: _harvesterController__WEBPACK_IMPORTED_MODULE_0__["HarvesterController"],
    transfer: _transferController__WEBPACK_IMPORTED_MODULE_6__["TransferController"],
    upgrader: _upgraderController__WEBPACK_IMPORTED_MODULE_1__["UpgraderController"],
    builder: _builderController__WEBPACK_IMPORTED_MODULE_2__["BuilderController"],
    repairer: _repairerController__WEBPACK_IMPORTED_MODULE_3__["RepairController"],
};
const creepMap = new Map();
// 删除过期数据
for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key];
    }
}
// 数据预处理
for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    const list = creepMap.get(creep.memory.type);
    if (list) {
        list.push(creep);
    }
    else {
        creepMap.set(creep.memory.type, [creep]);
    }
}
let spawning = null;
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
const list = ["harvester" /* Harvester */, "transfer" /* Transfer */, "upgrader" /* Upgrader */, "builder" /* Builder */, "repairer" /* Repairer */];
// 最少生成一项
for (let i = 0; i < list.length; i++) {
    const l = creepMap.get(list[i]);
    if (l) {
        if (l.length >= 10) {
            list.splice(i, 1);
            i--;
        }
    }
    else {
        spawning = list[i];
        break;
    }
}
// 操作并且对闲置计数
creepMap.forEach((creeps, type) => {
    var _a;
    let count = (_a = Memory[type]) !== null && _a !== void 0 ? _a : 0;
    for (let i = 0; i < creeps.length; i++) {
        count += creepControllerMap[creeps[i].memory.type].ticker(creeps[i]);
    }
    if (count <= 0) {
        delete Memory[type];
    }
    else {
        Memory[type] = count;
        const index = list.indexOf(type);
        if (index >= 0) {
            list.splice(index, 1);
        }
    }
});
// 生成新creeps
if (spawning === null) {
    spawning = Object(_util__WEBPACK_IMPORTED_MODULE_4__["RandomObjectInList"])(list);
}
if (spawning !== null) {
    const controller = creepControllerMap[spawning];
    if (spawn.room.energyAvailable >= controller.minEnergy) {
        const name = `${spawning}-${spawn.name}-${Game.time}`;
        const result = controller.create(spawn, name, spawn.room.energyAvailable);
        if (result === OK) {
            Game.creeps[name].memory.type = controller.type;
        }
        else {
            Game.notify(`spawn object fail:${spawning} ${name} ${result}`, 60);
        }
    }
}


/***/ }),

/***/ "./src/patch.ts":
/*!**********************!*\
  !*** ./src/patch.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Game.killAllCreeps = () => {
    for (const name in Game.creeps) {
        Game.creeps[name].suicide();
        delete Memory.creeps[name];
    }
};


/***/ }),

/***/ "./src/pickup.ts":
/*!***********************!*\
  !*** ./src/pickup.ts ***!
  \***********************/
/*! exports provided: Pickup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pickup", function() { return Pickup; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

function Pickup(creep) {
    let target = null;
    if (creep.memory.pickupId) {
        target = Game.getObjectById(creep.memory.pickupId);
    }
    if (target === null) {
        const source = creep.room.find(FIND_DROPPED_RESOURCES);
        target = Object(_util__WEBPACK_IMPORTED_MODULE_0__["RandomObjectInList"])(source);
        if (target) {
            creep.memory.pickupId = target.id;
        }
    }
    if (target) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.say('捡起中');
            creep.moveTo(target);
            return -1;
        }
        else {
            return -1;
        }
    }
    else {
        creep.say('闲置中');
        return 10;
    }
}


/***/ }),

/***/ "./src/repair.ts":
/*!***********************!*\
  !*** ./src/repair.ts ***!
  \***********************/
/*! exports provided: Repair */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Repair", function() { return Repair; });
function Repair(creep) {
    let target = null;
    if (creep.memory.repairId) {
        target = Game.getObjectById(creep.memory.repairId);
        if (target && (target.hits === target.hitsMax)) {
            target = null;
        }
    }
    if (target === null) {
        const source = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
        if (source.length > 0) {
            target = source.reduce((pre, cur) => {
                if (pre.hits < cur.hits) {
                    return pre;
                }
                else {
                    return cur;
                }
            });
            creep.memory.repairId = target.id;
        }
    }
    if (target) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.say('维修中');
            creep.moveTo(target);
            return 0;
        }
        else {
            return -2;
        }
    }
    else {
        creep.say('闲置中');
        return 10;
    }
}


/***/ }),

/***/ "./src/repairerController.ts":
/*!***********************************!*\
  !*** ./src/repairerController.ts ***!
  \***********************************/
/*! exports provided: RepairController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RepairController", function() { return RepairController; });
/* harmony import */ var _creepController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creepController */ "./src/creepController.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _repair__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./repair */ "./src/repair.ts");
/* harmony import */ var _withdraw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./withdraw */ "./src/withdraw.ts");




const RepairController = {
    type: "repairer" /* Repairer */,
    minEnergy: Object(_creepController__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['work', 'carry', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.carry);
        if (maxCount > 0) {
            const count = Object(_util__WEBPACK_IMPORTED_MODULE_1__["RandomInt"])(maxCount + 1);
            if (count > 0) {
                body.splice(1, 0, ...new Array(count).fill('carry'));
            }
        }
        return spawn.spawnCreep(body, name);
    },
    ticker(creep) {
        var _a, _b;
        let repairing = (_a = creep.memory.repairing) !== null && _a !== void 0 ? _a : false;
        if (repairing) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                repairing = false;
                delete creep.memory.repairId;
                delete creep.memory.repairTick;
            }
            else {
                const tick = ((_b = creep.memory.repairTick) !== null && _b !== void 0 ? _b : 300) - 1;
                if (tick <= 0) {
                    delete creep.memory.repairId;
                    delete creep.memory.repairTick;
                }
                else {
                    creep.memory.repairTick = tick;
                }
            }
        }
        else {
            if (creep.store.getFreeCapacity() === 0) {
                repairing = true;
                delete creep.memory.withdrawId;
            }
        }
        if (repairing) {
            creep.memory.repairing = true;
        }
        else {
            delete creep.memory.repairing;
        }
        if (repairing) {
            return Object(_repair__WEBPACK_IMPORTED_MODULE_2__["Repair"])(creep);
        }
        else {
            return Object(_withdraw__WEBPACK_IMPORTED_MODULE_3__["Withdraw"])(creep);
        }
    },
};


/***/ }),

/***/ "./src/transfer.ts":
/*!*************************!*\
  !*** ./src/transfer.ts ***!
  \*************************/
/*! exports provided: Transfer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transfer", function() { return Transfer; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

function Transfer(creep) {
    let target = null;
    if (creep.memory.transferId) {
        target = Game.getObjectById(creep.memory.transferId);
        if (target && target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            target = null;
        }
    }
    if (target === null) {
        const source = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER
                    || (structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_TOWER
                        || structure.structureType === STRUCTURE_EXTENSION
                            && structure.my))
                    && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        target = Object(_util__WEBPACK_IMPORTED_MODULE_0__["RandomObjectInList"])(source);
        if (target) {
            creep.memory.transferId = target.id;
        }
    }
    if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.say('运输中');
            creep.moveTo(target);
            return 0;
        }
        else {
            return -2;
        }
    }
    else {
        creep.say('闲置中');
        return 10;
    }
}


/***/ }),

/***/ "./src/transferController.ts":
/*!***********************************!*\
  !*** ./src/transferController.ts ***!
  \***********************************/
/*! exports provided: TransferController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransferController", function() { return TransferController; });
/* harmony import */ var _creepController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creepController */ "./src/creepController.ts");
/* harmony import */ var _transfer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transfer */ "./src/transfer.ts");
/* harmony import */ var _pickup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pickup */ "./src/pickup.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");




const TransferController = {
    type: "transfer" /* Transfer */,
    minEnergy: Object(_creepController__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['carry', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['carry', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.carry);
        if (maxCount > 0) {
            const count = Object(_util__WEBPACK_IMPORTED_MODULE_3__["RandomInt"])(maxCount + 1);
            if (count > 0) {
                body.splice(1, 0, ...new Array(count).fill('carry'));
            }
        }
        return spawn.spawnCreep(body, name);
    },
    ticker(creep) {
        var _a;
        let transfering = (_a = creep.memory.transfering) !== null && _a !== void 0 ? _a : false;
        if (transfering) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                transfering = false;
                delete creep.memory.transferId;
            }
        }
        else {
            if (creep.store.getFreeCapacity() === 0) {
                transfering = true;
                delete creep.memory.pickupId;
            }
        }
        if (transfering) {
            creep.memory.transfering = true;
        }
        else {
            delete creep.memory.transfering;
        }
        if (transfering) {
            return Object(_transfer__WEBPACK_IMPORTED_MODULE_1__["Transfer"])(creep);
        }
        else {
            return Object(_pickup__WEBPACK_IMPORTED_MODULE_2__["Pickup"])(creep);
        }
    },
};


/***/ }),

/***/ "./src/upgrade.ts":
/*!************************!*\
  !*** ./src/upgrade.ts ***!
  \************************/
/*! exports provided: Upgrade */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Upgrade", function() { return Upgrade; });
function Upgrade(creep) {
    if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.say('升级中');
            creep.moveTo(creep.room.controller);
            return 0;
        }
        else {
            return -2;
        }
    }
    else {
        creep.say('闲置中');
        return 10;
    }
}


/***/ }),

/***/ "./src/upgraderController.ts":
/*!***********************************!*\
  !*** ./src/upgraderController.ts ***!
  \***********************************/
/*! exports provided: UpgraderController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpgraderController", function() { return UpgraderController; });
/* harmony import */ var _creepController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creepController */ "./src/creepController.ts");
/* harmony import */ var _upgrade__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./upgrade */ "./src/upgrade.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _withdraw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./withdraw */ "./src/withdraw.ts");




const UpgraderController = {
    type: "upgrader" /* Upgrader */,
    minEnergy: Object(_creepController__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['work', 'carry', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.carry);
        if (maxCount > 0) {
            const count = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomInt"])(maxCount + 1);
            if (count > 0) {
                body.splice(1, 0, ...new Array(count).fill('carry'));
            }
        }
        return spawn.spawnCreep(body, name);
    },
    ticker(creep) {
        var _a;
        let upgrading = (_a = creep.memory.upgrading) !== null && _a !== void 0 ? _a : false;
        if (upgrading) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                upgrading = false;
            }
        }
        else {
            if (creep.store.getFreeCapacity() === 0) {
                upgrading = true;
                delete creep.memory.withdrawId;
            }
        }
        if (upgrading) {
            creep.memory.upgrading = true;
        }
        else {
            delete creep.memory.upgrading;
        }
        if (upgrading) {
            return Object(_upgrade__WEBPACK_IMPORTED_MODULE_1__["Upgrade"])(creep);
        }
        else {
            return Object(_withdraw__WEBPACK_IMPORTED_MODULE_3__["Withdraw"])(creep);
        }
    },
};


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! exports provided: RandomInt, RandomObjectInList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomInt", function() { return RandomInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomObjectInList", function() { return RandomObjectInList; });
function RandomInt(max, min = 0) {
    return min + Math.floor(Math.random() * (max - min));
}
function RandomObjectInList(list) {
    if (list.length > 0) {
        return list[Math.floor(Math.random() * list.length)];
    }
    else {
        return null;
    }
}


/***/ }),

/***/ "./src/withdraw.ts":
/*!*************************!*\
  !*** ./src/withdraw.ts ***!
  \*************************/
/*! exports provided: Withdraw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Withdraw", function() { return Withdraw; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

function Withdraw(creep) {
    let target = null;
    if (creep.memory.withdrawId) {
        target = Game.getObjectById(creep.memory.withdrawId);
        if (target && target.store.energy === 0) {
            target = null;
        }
    }
    if (target === null) {
        const source = creep.room.find(FIND_RUINS, {
            filter: (ruin) => ruin.store.energy > 0
        });
        target = Object(_util__WEBPACK_IMPORTED_MODULE_0__["RandomObjectInList"])(source);
        if (target === null) {
            const source = creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => tombstone.store.energy > 0
            });
            target = Object(_util__WEBPACK_IMPORTED_MODULE_0__["RandomObjectInList"])(source);
        }
        if (target === null) {
            const source = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER
                    || (structure.structureType === STRUCTURE_EXTENSION && structure.my))
                    && structure.store.energy > 0
            });
            target = Object(_util__WEBPACK_IMPORTED_MODULE_0__["RandomObjectInList"])(source);
        }
        if (target) {
            creep.memory.withdrawId = target.id;
        }
    }
    if (target) {
        if (creep.withdraw(target, 'energy') === ERR_NOT_IN_RANGE) {
            creep.say('提取中');
            creep.moveTo(target);
            return 0;
        }
        else {
            return -2;
        }
    }
    else {
        return 10;
    }
}


/***/ })

/******/ });
//# sourceMappingURL=main.js.map