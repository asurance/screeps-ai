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

/***/ "./src/build.ts":
/*!**********************!*\
  !*** ./src/build.ts ***!
  \**********************/
/*! exports provided: Build */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Build", function() { return Build; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

function Build(creep) {
    let target = null;
    if (creep.memory.buildId) {
        target = Game.getObjectById(creep.memory.buildId);
    }
    if (target === null) {
        const source = creep.room.find(FIND_CONSTRUCTION_SITES);
        target = Object(_util__WEBPACK_IMPORTED_MODULE_0__["RandomObjectInList"])(source);
        if (target) {
            creep.memory.buildId = target.id;
        }
    }
    if (target) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        creep.say('建造中');
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
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
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
/* harmony import */ var _build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./build */ "./src/build.ts");
/* harmony import */ var _harvest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./harvest */ "./src/harvest.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");




const BuilderController = {
    type: "builder" /* Builder */,
    minEnergy: Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['work', 'carry', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / _baseCreep__WEBPACK_IMPORTED_MODULE_0__["EnergyMap"].carry);
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
                delete creep.memory.harvestId;
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
            return Object(_harvest__WEBPACK_IMPORTED_MODULE_2__["Harvest"])(creep);
        }
    },
};


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
            creep.moveTo(target);
        }
        creep.say('采集中');
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
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
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
/* harmony import */ var _harvest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./harvest */ "./src/harvest.ts");
/* harmony import */ var _transfer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transfer */ "./src/transfer.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");




const HarvesterController = {
    type: "harvester" /* Harvester */,
    minEnergy: Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['work', 'carry', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / _baseCreep__WEBPACK_IMPORTED_MODULE_0__["EnergyMap"].carry);
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
                delete creep.memory.harvestId;
            }
        }
        if (transfering) {
            creep.memory.transfering = true;
        }
        else {
            delete creep.memory.transfering;
        }
        if (transfering) {
            return Object(_transfer__WEBPACK_IMPORTED_MODULE_2__["Transfer"])(creep);
        }
        else {
            return Object(_harvest__WEBPACK_IMPORTED_MODULE_1__["Harvest"])(creep);
        }
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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./patch */ "./src/patch.ts");
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_patch__WEBPACK_IMPORTED_MODULE_4__);





for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key];
    }
}
const creepControllerMap = {
    harvester: _harvesterController__WEBPACK_IMPORTED_MODULE_0__["HarvesterController"],
    upgrader: _upgraderController__WEBPACK_IMPORTED_MODULE_1__["UpgraderController"],
    builder: _builderController__WEBPACK_IMPORTED_MODULE_2__["BuilderController"],
};
const creepMap = new Map();
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
const list = ["harvester" /* Harvester */, "upgrader" /* Upgrader */, "builder" /* Builder */];
for (let i = 0; i < list.length; i++) {
    const l = creepMap.get(list[i]);
    if (l) {
        if (l.length >= 5) {
            list.splice(i, 1);
            i--;
        }
    }
    else {
        spawning = list[i];
        break;
    }
}
if (spawning === null && list.length > 0) {
    creepMap.forEach((creeps, type) => {
        let flag = true;
        for (let i = 0; i < creeps.length; i++) {
            flag = creepControllerMap[creeps[i].memory.type].ticker(creeps[i]) && flag;
        }
        if (!flag) {
            const index = list.indexOf(type);
            if (index >= 0) {
                list.splice(index, 1);
            }
        }
    });
    spawning = Object(_util__WEBPACK_IMPORTED_MODULE_3__["RandomObjectInList"])(list);
}
else {
    creepMap.forEach(creeps => creeps.forEach(creep => creepControllerMap[creep.memory.type].ticker(creep)));
}
if (spawning !== null) {
    const controller = creepControllerMap[spawning];
    if (spawn.room.energyAvailable >= controller.minEnergy) {
        const name = `${spawn.name}-${Game.time}`;
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
    }
    if (target === null) {
        const source = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_EXTENSION
                    || structure.structureType === STRUCTURE_SPAWN
                    || structure.structureType === STRUCTURE_TOWER
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
            creep.moveTo(target);
        }
        creep.say('运输中');
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}


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
            creep.moveTo(creep.room.controller);
        }
        creep.say('升级中');
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
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
/* harmony import */ var _baseCreep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseCreep */ "./src/baseCreep.ts");
/* harmony import */ var _harvest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./harvest */ "./src/harvest.ts");
/* harmony import */ var _upgrade__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./upgrade */ "./src/upgrade.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");




const UpgraderController = {
    type: "upgrader" /* Upgrader */,
    minEnergy: Object(_baseCreep__WEBPACK_IMPORTED_MODULE_0__["GetRequiredEnergy"])(['work', 'carry', 'move']),
    create(spawn, name, maxEnergy) {
        const body = ['work', 'carry', 'move'];
        const maxCount = Math.floor((maxEnergy - this.minEnergy) / _baseCreep__WEBPACK_IMPORTED_MODULE_0__["EnergyMap"].carry);
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
        let upgrading = (_a = creep.memory.upgrading) !== null && _a !== void 0 ? _a : false;
        if (upgrading) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                upgrading = false;
            }
        }
        else {
            if (creep.store.getFreeCapacity() === 0) {
                upgrading = true;
                delete creep.memory.harvestId;
            }
        }
        if (upgrading) {
            creep.memory.upgrading = true;
        }
        else {
            delete creep.memory.upgrading;
        }
        if (upgrading) {
            return Object(_upgrade__WEBPACK_IMPORTED_MODULE_2__["Upgrade"])(creep);
        }
        else {
            return Object(_harvest__WEBPACK_IMPORTED_MODULE_1__["Harvest"])(creep);
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


/***/ })

/******/ });
//# sourceMappingURL=main.js.map