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

/***/ "./src/command/build.ts":
/*!******************************!*\
  !*** ./src/command/build.ts ***!
  \******************************/
/*! exports provided: SetCreepBuild, Build */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCreepBuild", function() { return SetCreepBuild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Build", function() { return Build; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

/**
 * 建造前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepBuild(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
/**
 * 建造
 * @param creep Creep
 */
function Build(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.energy > 0) {
            if (target.progress < target.progressTotal) {
                if (creep.pos.inRangeTo(target, 3)) {
                    const result = creep.build(target);
                    if (result !== OK) {
                        Game.notify(`withdraw fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                    }
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 3 });
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                        }
                    }
                    return 1 /* Moving */;
                }
            }
            else {
                return 4 /* TargetNeedReplace */;
            }
        }
        else {
            return 2 /* RequireMoreEnergy */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}


/***/ }),

/***/ "./src/command/command.ts":
/*!********************************!*\
  !*** ./src/command/command.ts ***!
  \********************************/
/*! exports provided: SetNextCommand */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetNextCommand", function() { return SetNextCommand; });
/* harmony import */ var _build__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./build */ "./src/command/build.ts");
/* harmony import */ var _harvest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./harvest */ "./src/command/harvest.ts");
/* harmony import */ var _pickup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pickup */ "./src/command/pickup.ts");
/* harmony import */ var _repair__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./repair */ "./src/command/repair.ts");
/* harmony import */ var _transfer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transfer */ "./src/command/transfer.ts");
/* harmony import */ var _upgradeController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./upgradeController */ "./src/command/upgradeController.ts");
/* harmony import */ var _withdraw__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./withdraw */ "./src/command/withdraw.ts");







/**
 * 设置命令表
 */
const SetCommandMap = {
    ["harvest" /* Harvest */]: _harvest__WEBPACK_IMPORTED_MODULE_1__["SetCreepHarvest"],
    ["updateController" /* UpgradeController */]: _upgradeController__WEBPACK_IMPORTED_MODULE_5__["SetCreepUpgradeController"],
    ["transfer" /* Transfer */]: _transfer__WEBPACK_IMPORTED_MODULE_4__["SetCreepTransfer"],
    ["pickup" /* Pickup */]: _pickup__WEBPACK_IMPORTED_MODULE_2__["SetCreepPickup"],
    ["withdraw" /* Withdraw */]: _withdraw__WEBPACK_IMPORTED_MODULE_6__["SetCreepWithdraw"],
    ["build" /* Build */]: _build__WEBPACK_IMPORTED_MODULE_0__["SetCreepBuild"],
    ["repair" /* Repair */]: _repair__WEBPACK_IMPORTED_MODULE_3__["SetCreepRepair"],
};
/**
 * 设置creep命令
 * @param command 命令
 * @param creep creep
 * @param argv 剩余参数
 */
function SetNextCommand(command, creep, ...argv) {
    delete creep.memory.cmd;
    creep.memory.cmd = {
        type: command
    };
    // @ts-expect-error ts暂时无法识别该类型
    SetCommandMap[command](creep, ...argv);
}


/***/ }),

/***/ "./src/command/harvest.ts":
/*!********************************!*\
  !*** ./src/command/harvest.ts ***!
  \********************************/
/*! exports provided: SetCreepHarvest, Harvest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCreepHarvest", function() { return SetCreepHarvest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Harvest", function() { return Harvest; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

/**
 * 收获前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepHarvest(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
/**
 * 收获
 * @param creep Creep
 * @return 收获结果
 */
function Harvest(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (target.energy > 0 || target.ticksToRegeneration < 100) {
            if (creep.pos.inRangeTo(target.pos, 1)) {
                if (target.energy > 0) {
                    const result = creep.harvest(target);
                    if (result !== OK) {
                        Game.notify(`harvest fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                    }
                }
                return 0 /* OK */;
            }
            else {
                if (creep.fatigue <= 0) {
                    const result = creep.moveTo(target, { range: 1 });
                    if (result !== OK) {
                        Game.notify(`move fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                    }
                }
                return 1 /* Moving */;
            }
        }
        else {
            return 3 /* TargetNeedReplace */;
        }
    }
    else {
        return 2 /* TargetLost */;
    }
}


/***/ }),

/***/ "./src/command/pickup.ts":
/*!*******************************!*\
  !*** ./src/command/pickup.ts ***!
  \*******************************/
/*! exports provided: SetCreepPickup, Pickup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCreepPickup", function() { return SetCreepPickup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pickup", function() { return Pickup; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

function SetCreepPickup(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
/**
 * 捡起
 * @param creep Creep
 */
function Pickup(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (target.amount > 0) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.pickup(target);
                    if (result !== OK) {
                        Game.notify(`pickup fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                    }
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 1 });
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                        }
                    }
                    return 1 /* Moving */;
                }
            }
            else {
                return 4 /* TargetNeedReplace */;
            }
        }
        else {
            return 2 /* Full */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}


/***/ }),

/***/ "./src/command/repair.ts":
/*!*******************************!*\
  !*** ./src/command/repair.ts ***!
  \*******************************/
/*! exports provided: SetCreepRepair, Repair */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCreepRepair", function() { return SetCreepRepair; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Repair", function() { return Repair; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

/**
 * 维修前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepRepair(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
/**
 * 维修
 * @param creep Creep
 */
function Repair(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.energy > 0) {
            if (target.hits < target.hitsMax) {
                if (creep.pos.inRangeTo(target, 3)) {
                    const result = creep.repair(target);
                    if (result !== OK) {
                        Game.notify(`withdraw fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                    }
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 3 });
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                        }
                    }
                    return 1 /* Moving */;
                }
            }
            else {
                return 4 /* TargetNeedReplace */;
            }
        }
        else {
            return 2 /* RequireMoreEnergy */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}


/***/ }),

/***/ "./src/command/transfer.ts":
/*!*********************************!*\
  !*** ./src/command/transfer.ts ***!
  \*********************************/
/*! exports provided: SetCreepTransfer, Transfer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCreepTransfer", function() { return SetCreepTransfer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transfer", function() { return Transfer; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

/**
 * 转移前
 * @param creep Creep
 * @param target 转移目标
 */
function SetCreepTransfer(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
/**
 * 转移
 * @param creep Creep
 */
function Transfer(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.energy > 0) {
            let hasRest = false;
            switch (target.structureType) {
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_TOWER:
                    hasRest = target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    break;
                case STRUCTURE_CONTAINER:
                case STRUCTURE_STORAGE:
                    hasRest = target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    break;
            }
            if (hasRest) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.transfer(target, RESOURCE_ENERGY);
                    if (result !== OK) {
                        Game.notify(`transfer fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                    }
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 1 });
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                        }
                    }
                    return 1 /* Moving */;
                }
            }
            else {
                return 4 /* TargetNeedReplace */;
            }
        }
        else {
            return 2 /* RequireMoreEnergy */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}


/***/ }),

/***/ "./src/command/upgradeController.ts":
/*!******************************************!*\
  !*** ./src/command/upgradeController.ts ***!
  \******************************************/
/*! exports provided: SetCreepUpgradeController, UpdateController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCreepUpgradeController", function() { return SetCreepUpgradeController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateController", function() { return UpdateController; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

/**
 * 升级控制器前
 * @param creep Creep
 */
function SetCreepUpgradeController() {
    // TODO 暂时没有需要做的
}
function UpdateController(creep) {
    if (creep.store.energy > 0) {
        if (creep.pos.inRangeTo(creep.room.controller, 3)) {
            const result = creep.upgradeController(creep.room.controller);
            if (result !== OK) {
                Game.notify(`upgradeController fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
            }
            return 0 /* OK */;
        }
        else {
            if (creep.fatigue <= 0) {
                const result = creep.moveTo(creep.room.controller, { range: 3 });
                if (result !== OK) {
                    Game.notify(`move fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                }
            }
            return 1 /* Moving */;
        }
    }
    else {
        return 2 /* RequireMoreEnergy */;
    }
}


/***/ }),

/***/ "./src/command/withdraw.ts":
/*!*********************************!*\
  !*** ./src/command/withdraw.ts ***!
  \*********************************/
/*! exports provided: SetCreepWithdraw, Withdraw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCreepWithdraw", function() { return SetCreepWithdraw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Withdraw", function() { return Withdraw; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

/**
 * 取回前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepWithdraw(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
/**
 * 取回
 * @param creep Creep
 */
function Withdraw(creep) {
    const command = creep.memory.cmd;
    const target = Game.getObjectById(command.target);
    if (target) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (target.store.energy > 0) {
                if (creep.pos.inRangeTo(target, 1)) {
                    const result = creep.withdraw(target, RESOURCE_ENERGY);
                    if (result !== OK) {
                        Game.notify(`withdraw fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                    }
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        const result = creep.moveTo(target, { range: 1 });
                        if (result !== OK) {
                            Game.notify(`move fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_0__["config"].notifyInterval);
                        }
                    }
                    return 1 /* Moving */;
                }
            }
            else {
                return 4 /* TargetNeedReplace */;
            }
        }
        else {
            return 2 /* Full */;
        }
    }
    else {
        return 3 /* TargetLost */;
    }
}


/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! exports provided: config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
/**
 * 默认配置
 */
const defualtConfig = {
    notifyInterval: 24 * 60,
    harvester: 3,
    transferer: 8,
    worker: 4,
};
/**
 * 项目采用配置
 */
const config = Memory.config ? Object.assign(Object.assign({}, defualtConfig), Memory.config) : defualtConfig;


/***/ }),

/***/ "./src/global.ts":
/*!***********************!*\
  !*** ./src/global.ts ***!
  \***********************/
/*! exports provided: creepInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creepInfo", function() { return creepInfo; });
var _a, _b;
/**
 * creep信息
 */
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


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./patch */ "./src/patch.ts");
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_patch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global */ "./src/global.ts");
/* harmony import */ var _strategy_harvester__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./strategy/harvester */ "./src/strategy/harvester.ts");
/* harmony import */ var _command_harvest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./command/harvest */ "./src/command/harvest.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config */ "./src/config.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _command_upgradeController__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./command/upgradeController */ "./src/command/upgradeController.ts");
/* harmony import */ var _command_transfer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./command/transfer */ "./src/command/transfer.ts");
/* harmony import */ var _command_pickup__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./command/pickup */ "./src/command/pickup.ts");
/* harmony import */ var _strategy_transferer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./strategy/transferer */ "./src/strategy/transferer.ts");
/* harmony import */ var _strategy_worker__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./strategy/worker */ "./src/strategy/worker.ts");
/* harmony import */ var _command_withdraw__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./command/withdraw */ "./src/command/withdraw.ts");
/* harmony import */ var _command_build__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./command/build */ "./src/command/build.ts");
/* harmony import */ var _command_repair__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./command/repair */ "./src/command/repair.ts");















// 删除过期数据
for (const key in Memory.creeps) {
    if (!(key in Game.creeps)) {
        delete Memory.creeps[key];
    }
}
// 数据
const strategyMap = {
    harvester: _strategy_harvester__WEBPACK_IMPORTED_MODULE_2__["Harvester"],
    transferer: _strategy_transferer__WEBPACK_IMPORTED_MODULE_9__["Transferer"],
    worker: _strategy_worker__WEBPACK_IMPORTED_MODULE_10__["Worker"],
};
const commandMap = {
    harvest: _command_harvest__WEBPACK_IMPORTED_MODULE_3__["Harvest"],
    updateController: _command_upgradeController__WEBPACK_IMPORTED_MODULE_6__["UpdateController"],
    transfer: _command_transfer__WEBPACK_IMPORTED_MODULE_7__["Transfer"],
    pickup: _command_pickup__WEBPACK_IMPORTED_MODULE_8__["Pickup"],
    withdraw: _command_withdraw__WEBPACK_IMPORTED_MODULE_11__["Withdraw"],
    build: _command_build__WEBPACK_IMPORTED_MODULE_12__["Build"],
    repair: _command_repair__WEBPACK_IMPORTED_MODULE_13__["Repair"],
};
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
// creep操作
for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (!creep.spawning) {
        const strategyType = creep.memory.strategy.type;
        if (creep.memory.cmd) {
            const commandType = creep.memory.cmd.type;
            // @ts-expect-error ts暂时无法识别该类型
            strategyMap[strategyType].callbackMap[commandType](creep, commandMap[commandType](creep));
        }
        else {
            strategyMap[strategyType].start(creep);
        }
    }
}
// 生成新creep
if (!spawn.spawning) {
    let spawing = null;
    let list = ["harvester" /* Harvester */, "transferer" /* Transferer */, "worker" /* Worker */];
    for (let i = 0; i < list.length; i++) {
        const map = _global__WEBPACK_IMPORTED_MODULE_1__["creepInfo"].get(list[i]);
        if (map) {
            let sum = 0;
            map.forEach(v => sum += v.length);
            if (sum >= _config__WEBPACK_IMPORTED_MODULE_4__["config"][list[i]]) {
                list.splice(i, 1);
                i--;
            }
        }
        else {
            spawing = list[i];
            break;
        }
    }
    if (spawing) {
        if (spawn.room.energyAvailable < strategyMap[spawing].minEnergy) {
            spawing = null;
        }
    }
    else {
        list = list.filter(s => spawn.room.energyAvailable >= strategyMap[s].minEnergy);
        spawing = Object(_util__WEBPACK_IMPORTED_MODULE_5__["RandomObjectInList"])(list);
    }
    if (spawing) {
        const name = `${spawn.name}-${spawing}-${Game.time}`;
        const result = spawn.spawnCreep(strategyMap[spawing].create(spawn.room.energyAvailable), name);
        if (result === OK) {
            const creep = Game.creeps[name];
            creep.memory.strategy = {
                type: spawing
            };
            strategyMap[spawing].initStrategy(creep);
        }
        else {
            Game.notify(`spawn creep fail with code:${result}`, _config__WEBPACK_IMPORTED_MODULE_4__["config"].notifyInterval);
        }
    }
}


/***/ }),

/***/ "./src/moveCache.ts":
/*!**************************!*\
  !*** ./src/moveCache.ts ***!
  \**************************/
/*! exports provided: initMoveCache, checkMoveFail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initMoveCache", function() { return initMoveCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkMoveFail", function() { return checkMoveFail; });
/**
 * 初始化移动缓存
 * @param creep Creep
 * @return 初始移动缓存数据
 */
function initMoveCache(creep) {
    return {
        pos: creep.pos.x + creep.pos.y * 50,
        ticker: 60,
    };
}
/**
 * 检测移动失效
 * @param creep Creep
 * @param data 移动缓存数据
 * @return 是否失效
 */
function checkMoveFail(creep, data) {
    const x = data.pos % 50;
    const y = Math.floor(data.pos / 50);
    if (creep.pos.inRangeTo(x, y, 3)) {
        data.ticker--;
        if (data.ticker <= 0) {
            data.ticker = 30;
            return true;
        }
        else {
            return false;
        }
    }
    else {
        data.pos = creep.pos.x + creep.pos.y * 50;
        data.ticker = 30;
        return false;
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
Game.clearRoomInfo = () => {
    for (const name in Memory.rooms) {
        delete Memory.rooms[name];
    }
};
Game.Restart = () => {
    Game.clearRoomInfo();
    Game.killAllCreeps();
};


/***/ }),

/***/ "./src/strategy/harvester.ts":
/*!***********************************!*\
  !*** ./src/strategy/harvester.ts ***!
  \***********************************/
/*! exports provided: Harvester */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Harvester", function() { return Harvester; });
/* harmony import */ var _command_command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../command/command */ "./src/command/command.ts");
/* harmony import */ var _moveCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../moveCache */ "./src/moveCache.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/util.ts");



/**
 * 采集者策略
 */
const Harvester = {
    minEnergy: Object(_util__WEBPACK_IMPORTED_MODULE_2__["GetRequiredEnergy"])([MOVE, WORK]),
    create(maxEnergy) {
        const count = Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work);
        const body = [MOVE, WORK];
        body.splice(0, 0, ...new Array(count).fill(WORK));
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["initMoveCache"])(creep);
    },
    start(creep) {
        FindNextTarget(creep);
    },
    callbackMap: {
        ["harvest" /* Harvest */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 2 /* TargetLost */:
                case 3 /* TargetNeedReplace */:
                    FindNextTarget(creep);
                    break;
                case 1 /* Moving */:
                    if (Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["checkMoveFail"])(creep, strategy.moveCache)) {
                        FindNextTarget(creep);
                    }
                    break;
            }
        }
    },
};
/**
 * 找到下一个采集目标
 * @param creep creep
 * @return 是否成功
 */
function FindNextTarget(creep) {
    const roomInfos = Object(_util__WEBPACK_IMPORTED_MODULE_2__["GetRoomInfo"])(creep.room);
    const sourceId = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomObjectInList"])(roomInfos.sourceInfo);
    if (sourceId) {
        const target = Game.getObjectById(sourceId);
        if (target) {
            Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("harvest" /* Harvest */, creep, target);
            return true;
        }
    }
    creep.say('闲置中');
    return false;
}


/***/ }),

/***/ "./src/strategy/transferer.ts":
/*!************************************!*\
  !*** ./src/strategy/transferer.ts ***!
  \************************************/
/*! exports provided: Transferer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transferer", function() { return Transferer; });
/* harmony import */ var _command_command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../command/command */ "./src/command/command.ts");
/* harmony import */ var _moveCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../moveCache */ "./src/moveCache.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/util.ts");



/**
 * 运输者
 */
const Transferer = {
    minEnergy: Object(_util__WEBPACK_IMPORTED_MODULE_2__["GetRequiredEnergy"])([CARRY, MOVE]),
    create(maxEnergy) {
        let rest = maxEnergy - this.minEnergy;
        const body = [CARRY, MOVE];
        if (rest >= BODYPART_COST.carry) {
            body.unshift(CARRY);
            rest -= BODYPART_COST.carry;
        }
        const count = Math.floor(rest / (BODYPART_COST.carry * 2 + BODYPART_COST.move));
        for (let i = 0; i < count; i++) {
            body.push(CARRY, CARRY, MOVE);
        }
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["initMoveCache"])(creep);
    },
    start(creep) {
        FindPickupTarget(creep);
    },
    callbackMap: {
        ["pickup" /* Pickup */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 3 /* TargetLost */:
                case 4 /* TargetNeedReplace */:
                    if (!FindPickupTarget(creep) && creep.store.energy > 0) {
                        FindTransferTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["checkMoveFail"])(creep, strategy.moveCache)) {
                        FindPickupTarget(creep);
                    }
                    break;
                case 2 /* Full */:
                    FindTransferTarget(creep);
                    break;
            }
        },
        ["transfer" /* Transfer */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 3 /* TargetLost */:
                case 4 /* TargetNeedReplace */:
                    if (!FindTransferTarget(creep)) {
                        FindPickupTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["checkMoveFail"])(creep, strategy.moveCache)) {
                        FindTransferTarget(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindPickupTarget(creep);
                    break;
            }
        },
    }
};
/**
 * 找到下一个捡起目标
 * @param creep creep
 */
function FindPickupTarget(creep) {
    const target = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomObjectInList"])(creep.room.find(FIND_DROPPED_RESOURCES));
    if (target) {
        Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("pickup" /* Pickup */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
/**
 * 找到下一个转移目标
 * @param creep creep
 */
function FindTransferTarget(creep) {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure => {
            switch (structure.structureType) {
                case STRUCTURE_EXTENSION:
                case STRUCTURE_SPAWN:
                case STRUCTURE_TOWER:
                    return structure.my && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                case STRUCTURE_STORAGE:
                    return structure.my && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                case STRUCTURE_CONTAINER:
                    return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            return false;
        }),
        range: 1,
    });
    if (target) {
        Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("transfer" /* Transfer */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}


/***/ }),

/***/ "./src/strategy/worker.ts":
/*!********************************!*\
  !*** ./src/strategy/worker.ts ***!
  \********************************/
/*! exports provided: Worker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Worker", function() { return Worker; });
/* harmony import */ var _command_command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../command/command */ "./src/command/command.ts");
/* harmony import */ var _moveCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../moveCache */ "./src/moveCache.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/util.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../global */ "./src/global.ts");




/**
 * 采集者策略
 */
const Worker = {
    minEnergy: Object(_util__WEBPACK_IMPORTED_MODULE_2__["GetRequiredEnergy"])([MOVE, WORK, CARRY]),
    create(maxEnergy) {
        const count = Math.floor(maxEnergy / (BODYPART_COST.work + BODYPART_COST.move + BODYPART_COST.carry));
        const body = [];
        for (let i = 0; i < count; i++) {
            body.push(MOVE, WORK, CARRY);
        }
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["initMoveCache"])(creep);
    },
    start(creep) {
        FindWithdrawTarget(creep);
    },
    callbackMap: {
        ["withdraw" /* Withdraw */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 3 /* TargetLost */:
                case 4 /* TargetNeedReplace */:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep);
                    }
                    else {
                        FindWithdrawTarget(creep);
                    }
                    break;
                case 2 /* Full */:
                    FindNextWork(creep);
                    break;
                case 1 /* Moving */:
                    if (Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["checkMoveFail"])(creep, strategy.moveCache)) {
                        FindRandomWithdrawTarget(creep);
                    }
            }
        },
        ["updateController" /* UpgradeController */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 1 /* Moving */:
                    if (Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["checkMoveFail"])(creep, strategy.moveCache)) {
                        FindNextWork(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindWithdrawTarget(creep);
                    break;
            }
        },
        ["build" /* Build */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 4 /* TargetNeedReplace */:
                case 3 /* TargetLost */:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep);
                    }
                    else {
                        FindWithdrawTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["checkMoveFail"])(creep, strategy.moveCache)) {
                        FindNextWork(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindWithdrawTarget(creep);
                    break;
            }
        },
        ["repair" /* Repair */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 4 /* TargetNeedReplace */:
                case 3 /* TargetLost */:
                    if (creep.store.energy > 0) {
                        FindNextWork(creep);
                    }
                    else {
                        FindWithdrawTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (Object(_moveCache__WEBPACK_IMPORTED_MODULE_1__["checkMoveFail"])(creep, strategy.moveCache)) {
                        FindNextWork(creep);
                    }
                    break;
                case 2 /* RequireMoreEnergy */:
                    FindWithdrawTarget(creep);
                    break;
            }
        },
    },
};
function FindWithdrawTarget(creep) {
    let target = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (tombstone) => tombstone.store.energy > 0 });
    if (target === null) {
        target = creep.pos.findClosestByPath(FIND_RUINS, { filter: (ruin) => ruin.store.energy > 0 });
    }
    if (target === null) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => ((structure.structureType === STRUCTURE_CONTAINER)
                || (structure.structureType === STRUCTURE_STORAGE && structure.my))
                && structure.store.energy > 0
        });
    }
    if (target) {
        Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("withdraw" /* Withdraw */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindRandomWithdrawTarget(creep) {
    const targets = creep.room.find(FIND_TOMBSTONES, { filter: (tombstone) => tombstone.store.energy > 0 });
    targets.push(...creep.room.find(FIND_RUINS, { filter: (ruin) => ruin.store.energy > 0 }));
    targets.push(...creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => ((structure.structureType === STRUCTURE_CONTAINER)
            || (structure.structureType === STRUCTURE_STORAGE && structure.my))
            && structure.store.energy > 0
    }));
    const target = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomObjectInList"])(targets);
    if (target) {
        Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("withdraw" /* Withdraw */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindBuildTarget(creep) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: (constructionSite) => constructionSite.progress < constructionSite.progressTotal
    });
    if (targets.length > 0) {
        const target = targets.reduce((pre, cur) => {
            if (pre.progressTotal < cur.progressTotal / 10) {
                return pre;
            }
            else if (cur.progressTotal < pre.progressTotal / 10) {
                return cur;
            }
            else {
                return pre.progress / pre.progressTotal > cur.progress / cur.progressTotal ?
                    pre : cur;
            }
        });
        Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("build" /* Build */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindRepairTarget(creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure => structure.hits < structure.hitsMax)
    });
    if (targets.length > 0) {
        const target = targets.reduce((pre, cur) => {
            if (pre.hits < 1000 && cur.hits < 1000) {
                return pre < cur ? pre : cur;
            }
            else {
                if (pre.hits < 1000) {
                    return pre;
                }
                if (cur.hits < 1000) {
                    return cur;
                }
                return pre.hits / pre.hitsMax < cur.hits / cur.hitsMax ?
                    pre : cur;
            }
        });
        Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("repair" /* Repair */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindUpgradeTarget(creep) {
    if (creep.room.controller) {
        Object(_command_command__WEBPACK_IMPORTED_MODULE_0__["SetNextCommand"])("updateController" /* UpgradeController */, creep);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
const cmds = ["updateController" /* UpgradeController */, "build" /* Build */, "repair" /* Repair */];
const fns = [FindUpgradeTarget, FindBuildTarget, FindRepairTarget];
function FindNextWork(creep) {
    const counts = [0, 0, 0];
    const rest = [];
    const workers = _global__WEBPACK_IMPORTED_MODULE_3__["creepInfo"].get("worker" /* Worker */);
    if (workers) {
        cmds.forEach((cmd, index) => {
            const l = workers.get(cmd);
            if (l) {
                counts[index] = l.length;
            }
        });
    }
    const index = cmds.indexOf(creep.memory.cmd.type);
    if (index >= 0) {
        counts[index]--;
    }
    for (let i = 0; i < counts.length; i++) {
        if (counts[i] === 0) {
            const result = fns[i](creep);
            if (result) {
                return true;
            }
        }
        else {
            rest.push(i);
        }
    }
    let id = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomObjectInList"])(rest);
    while (id !== null) {
        const result = fns[id](creep);
        if (result) {
            return true;
        }
        const index = rest.indexOf(id);
        rest.splice(index, 1);
        id = Object(_util__WEBPACK_IMPORTED_MODULE_2__["RandomObjectInList"])(rest);
    }
    return false;
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! exports provided: RandomInt, RandomObjectInList, GetRequiredEnergy, GetRoomInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomInt", function() { return RandomInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomObjectInList", function() { return RandomObjectInList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetRequiredEnergy", function() { return GetRequiredEnergy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetRoomInfo", function() { return GetRoomInfo; });
/**
 * 随机整数
 * @param max 最大值
 * @param min 最小值,默认为0
 * @return 随机结果
 */
function RandomInt(max, min = 0) {
    return min + Math.floor(Math.random() * (max - min));
}
/**
 * 在列表中随机一个元素
 * @param list 列表
 * @return 列表长度为0,返回null,反之返回随机的元素
 */
function RandomObjectInList(list) {
    if (list.length > 0) {
        return list[Math.floor(Math.random() * list.length)];
    }
    else {
        return null;
    }
}
/**
 * 获取对应组件所需的能量
 * @param body 组件列表
 * @return 所及能量
 */
function GetRequiredEnergy(body) {
    return body.reduce((pre, cur) => {
        return pre + BODYPART_COST[cur];
    }, 0);
}
/**
 * 获取房间信息
 * @param room 房间
 */
function GetRoomInfo(room) {
    const name = room.name;
    if (name in Memory.rooms) {
        return Memory.rooms[name];
    }
    else {
        const roomData = {
            sourceInfo: room.find(FIND_SOURCES).map(source => source.id)
        };
        Memory.rooms[name] = roomData;
        return roomData;
    }
}


/***/ })

/******/ });
//# sourceMappingURL=main.js.map