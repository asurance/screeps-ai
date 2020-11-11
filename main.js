module.exports =
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Build = exports.SetCreepBuild = void 0;
/**
 * 建造前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepBuild(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepBuild = SetCreepBuild;
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
                    creep.build(target);
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        creep.moveTo(target, { range: 3 });
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
exports.Build = Build;


/***/ }),

/***/ "./src/command/command.ts":
/*!********************************!*\
  !*** ./src/command/command.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNextCommand = void 0;
const build_1 = __webpack_require__(/*! ./build */ "./src/command/build.ts");
const harvest_1 = __webpack_require__(/*! ./harvest */ "./src/command/harvest.ts");
const pickup_1 = __webpack_require__(/*! ./pickup */ "./src/command/pickup.ts");
const repair_1 = __webpack_require__(/*! ./repair */ "./src/command/repair.ts");
const transfer_1 = __webpack_require__(/*! ./transfer */ "./src/command/transfer.ts");
const upgradeController_1 = __webpack_require__(/*! ./upgradeController */ "./src/command/upgradeController.ts");
const withdraw_1 = __webpack_require__(/*! ./withdraw */ "./src/command/withdraw.ts");
/**
 * 设置命令表
 */
const SetCommandMap = {
    ["harvest" /* Harvest */]: harvest_1.SetCreepHarvest,
    ["updateController" /* UpgradeController */]: upgradeController_1.SetCreepUpgradeController,
    ["transfer" /* Transfer */]: transfer_1.SetCreepTransfer,
    ["pickup" /* Pickup */]: pickup_1.SetCreepPickup,
    ["withdraw" /* Withdraw */]: withdraw_1.SetCreepWithdraw,
    ["build" /* Build */]: build_1.SetCreepBuild,
    ["repair" /* Repair */]: repair_1.SetCreepRepair,
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
exports.SetNextCommand = SetNextCommand;


/***/ }),

/***/ "./src/command/harvest.ts":
/*!********************************!*\
  !*** ./src/command/harvest.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Harvest = exports.SetCreepHarvest = void 0;
/**
 * 收获前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepHarvest(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepHarvest = SetCreepHarvest;
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
                    creep.harvest(target);
                }
                return 0 /* OK */;
            }
            else {
                if (creep.fatigue <= 0) {
                    creep.moveTo(target, { range: 1 });
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
exports.Harvest = Harvest;


/***/ }),

/***/ "./src/command/pickup.ts":
/*!*******************************!*\
  !*** ./src/command/pickup.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Pickup = exports.SetCreepPickup = void 0;
function SetCreepPickup(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepPickup = SetCreepPickup;
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
                    creep.pickup(target);
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        creep.moveTo(target, { range: 1 });
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
exports.Pickup = Pickup;


/***/ }),

/***/ "./src/command/repair.ts":
/*!*******************************!*\
  !*** ./src/command/repair.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Repair = exports.SetCreepRepair = void 0;
/**
 * 维修前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepRepair(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepRepair = SetCreepRepair;
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
                    creep.repair(target);
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        creep.moveTo(target, { range: 3 });
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
exports.Repair = Repair;


/***/ }),

/***/ "./src/command/transfer.ts":
/*!*********************************!*\
  !*** ./src/command/transfer.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = exports.SetCreepTransfer = void 0;
/**
 * 转移前
 * @param creep Creep
 * @param target 转移目标
 */
function SetCreepTransfer(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepTransfer = SetCreepTransfer;
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
                    creep.transfer(target, RESOURCE_ENERGY);
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        creep.moveTo(target, { range: 1 });
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
exports.Transfer = Transfer;


/***/ }),

/***/ "./src/command/upgradeController.ts":
/*!******************************************!*\
  !*** ./src/command/upgradeController.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateController = exports.SetCreepUpgradeController = void 0;
/**
 * 升级控制器前
 * @param creep Creep
 */
function SetCreepUpgradeController() {
    // TODO 暂时没有需要做的
}
exports.SetCreepUpgradeController = SetCreepUpgradeController;
function UpdateController(creep) {
    if (creep.store.energy > 0) {
        if (creep.pos.inRangeTo(creep.room.controller, 3)) {
            creep.upgradeController(creep.room.controller);
            return 0 /* OK */;
        }
        else {
            if (creep.fatigue <= 0) {
                creep.moveTo(creep.room.controller, { range: 3 });
            }
            return 1 /* Moving */;
        }
    }
    else {
        return 2 /* RequireMoreEnergy */;
    }
}
exports.UpdateController = UpdateController;


/***/ }),

/***/ "./src/command/withdraw.ts":
/*!*********************************!*\
  !*** ./src/command/withdraw.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdraw = exports.SetCreepWithdraw = void 0;
/**
 * 取回前
 * @param creep Creep
 * @param target 目标
 */
function SetCreepWithdraw(creep, target) {
    const command = creep.memory.cmd;
    command.target = target.id;
}
exports.SetCreepWithdraw = SetCreepWithdraw;
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
                    creep.withdraw(target, RESOURCE_ENERGY);
                    return 0 /* OK */;
                }
                else {
                    if (creep.fatigue <= 0) {
                        creep.moveTo(target, { range: 1 });
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
exports.Withdraw = Withdraw;


/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
/**
 * 默认配置
 */
const defualtConfig = {
    notifyInterval: 24 * 60,
    harvester: 2,
    transferer: 8,
    worker: 5,
};
/**
 * 项目采用配置
 */
exports.config = Memory.config ? Object.assign(Object.assign({}, defualtConfig), Memory.config) : defualtConfig;


/***/ }),

/***/ "./src/deal.ts":
/*!*********************!*\
  !*** ./src/deal.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PopTree = exports.PushTree = exports.deal = void 0;
function deal() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room.terminal && room.terminal.store.energy > 0) {
            const orderTree = [];
            Game.market.getAllOrders({
                type: ORDER_BUY,
                resourceType: RESOURCE_ENERGY,
            }).forEach(order => {
                const amount = Math.min(room.terminal.store.energy, order.remainingAmount);
                const price = amount > 0 ? order.price * amount / (amount + Game.market.calcTransactionCost(amount, order.roomName, room.name)) : 0;
                const orderInfo = {
                    id: order.id,
                    price,
                    amount,
                };
                PushTree(orderTree, orderInfo);
            });
            let count = 0;
            let o = PopTree(orderTree);
            let rest = room.terminal.store.energy;
            while (count < 10 && o) {
                if (rest > 0) {
                    const sell = Math.min(rest, o.amount);
                    Game.market.deal(o.id, sell, room.name);
                    rest -= sell;
                }
                else {
                    break;
                }
                count++;
                o = PopTree(orderTree);
            }
        }
    }
}
exports.deal = deal;
function PushTree(tree, node) {
    let target = tree.length;
    while (target > 0) {
        const parent = Math.floor((target - 1) / 2);
        if (tree[parent].price < node.price) {
            target = parent;
        }
        else {
            break;
        }
    }
    tree[target] = node;
}
exports.PushTree = PushTree;
function PopTree(tree) {
    if (tree.length > 0) {
        if (tree.length === 1) {
            return tree.pop();
        }
        else {
            const max = tree[0];
            const last = tree.pop();
            let target = 0;
            while (target * 2 + 1 < tree.length) {
                let child = target * 2 + 1;
                if (tree[child + 1].price > tree[child].price) {
                    child++;
                }
                if (tree[child].price > last.price) {
                    target = child;
                }
                else {
                    break;
                }
            }
            tree[target] = last;
            return max;
        }
    }
    else {
        return null;
    }
}
exports.PopTree = PopTree;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = exports.creepInfo = void 0;
__webpack_require__(/*! ./patch */ "./src/patch.ts");
const harvester_1 = __webpack_require__(/*! ./strategy/harvester */ "./src/strategy/harvester.ts");
const harvest_1 = __webpack_require__(/*! ./command/harvest */ "./src/command/harvest.ts");
const config_1 = __webpack_require__(/*! ./config */ "./src/config.ts");
const util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
const roomInfo_1 = __webpack_require__(/*! ./roomInfo */ "./src/roomInfo.ts");
const upgradeController_1 = __webpack_require__(/*! ./command/upgradeController */ "./src/command/upgradeController.ts");
const transfer_1 = __webpack_require__(/*! ./command/transfer */ "./src/command/transfer.ts");
const pickup_1 = __webpack_require__(/*! ./command/pickup */ "./src/command/pickup.ts");
const transferer_1 = __webpack_require__(/*! ./strategy/transferer */ "./src/strategy/transferer.ts");
const worker_1 = __webpack_require__(/*! ./strategy/worker */ "./src/strategy/worker.ts");
const withdraw_1 = __webpack_require__(/*! ./command/withdraw */ "./src/command/withdraw.ts");
const build_1 = __webpack_require__(/*! ./command/build */ "./src/command/build.ts");
const repair_1 = __webpack_require__(/*! ./command/repair */ "./src/command/repair.ts");
const deal_1 = __webpack_require__(/*! ./deal */ "./src/deal.ts");
/**
 * creep信息
 */
exports.creepInfo = CreateCreepInfo();
function CreateCreepInfo() {
    var _a, _b;
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
    return creepInfo;
}
let isReset = true;
function loop() {
    if (isReset) {
        console.log('Reset');
        Game.notify('Reset', 3600);
        isReset = false;
    }
    const spawn = Game.spawns['Home'];
    // 删除过期数据
    for (const key in Memory.creeps) {
        if (!(key in Game.creeps)) {
            delete Memory.creeps[key];
            roomInfo_1.OnCreepDead(spawn.room, key);
        }
    }
    exports.creepInfo = CreateCreepInfo();
    // 数据
    const strategyMap = {
        harvester: harvester_1.Harvester,
        transferer: transferer_1.Transferer,
        worker: worker_1.Worker,
    };
    const commandMap = {
        harvest: harvest_1.Harvest,
        updateController: upgradeController_1.UpdateController,
        transfer: transfer_1.Transfer,
        pickup: pickup_1.Pickup,
        withdraw: withdraw_1.Withdraw,
        build: build_1.Build,
        repair: repair_1.Repair,
    };
    // 塔设置
    const towers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TOWER
            && structure.my
    });
    towers.forEach(tower => {
        if (tower.store.energy >= TOWER_CAPACITY / 2) {
            const creep = util_1.RandomObjectInList(tower.pos.findInRange(FIND_CREEPS, TOWER_OPTIMAL_RANGE, {
                filter: creep => creep.hits < creep.hitsMax
            }));
            if (creep) {
                tower.heal(creep);
            }
            const structure = util_1.RandomObjectInList(tower.pos.findInRange(FIND_STRUCTURES, TOWER_OPTIMAL_RANGE, {
                filter: structure => structure.hits < structure.hitsMax
            }));
            if (structure) {
                tower.repair(structure);
            }
        }
        const hostTile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostTile) {
            tower.attack(hostTile);
        }
    });
    // creep操作
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (!creep.spawning) {
            const strategy = strategyMap[creep.memory.strategy.type];
            if (creep.memory.cmd) {
                const commandType = creep.memory.cmd.type;
                if (commandType in strategy.callbackMap) {
                    // @ts-expect-error ts暂时无法识别该类型
                    strategy.callbackMap[commandType](creep, commandMap[commandType](creep));
                }
                else {
                    commandMap[commandType](creep);
                }
            }
            else {
                strategy.start(creep);
            }
        }
    }
    // 生成新creep
    if (!spawn.spawning) {
        let spawing = null;
        let list = ["harvester" /* Harvester */, "transferer" /* Transferer */, "worker" /* Worker */];
        for (let i = 0; i < list.length; i++) {
            const map = exports.creepInfo.get(list[i]);
            if (map) {
                let sum = 0;
                map.forEach(v => sum += v.length);
                if (sum >= config_1.config[list[i]]) {
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
            spawing = util_1.RandomObjectInList(list);
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
        }
    }
    // 回收多余能量
    if (Game.time % 10000 === 0) {
        deal_1.deal();
    }
    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 1000) {
        Game.cpu.generatePixel();
    }
}
exports.loop = loop;


/***/ }),

/***/ "./src/moveCache.ts":
/*!**************************!*\
  !*** ./src/moveCache.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMoveFail = exports.initMoveCache = void 0;
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
exports.initMoveCache = initMoveCache;
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
exports.checkMoveFail = checkMoveFail;


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

/***/ "./src/roomInfo.ts":
/*!*************************!*\
  !*** ./src/roomInfo.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.OnCreepDead = exports.GetRoomInfo = void 0;
/**
 * 获取房间信息
 * @param room 房间
 */
function GetRoomInfo(room) {
    if (!room.memory.sourceInfo) {
        room.memory.sourceInfo = room.find(FIND_SOURCES).map(source => source.id);
        room.memory.creepInfo = new Array(room.memory.sourceInfo.length).fill(null);
    }
    return room.memory;
}
exports.GetRoomInfo = GetRoomInfo;
function OnCreepDead(room, creepName) {
    if (room.memory.creepInfo) {
        const index = room.memory.creepInfo.indexOf(creepName);
        if (index >= 0) {
            room.memory.creepInfo[index] = null;
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
exports.OnCreepDead = OnCreepDead;


/***/ }),

/***/ "./src/strategy/harvester.ts":
/*!***********************************!*\
  !*** ./src/strategy/harvester.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Harvester = void 0;
const command_1 = __webpack_require__(/*! ../command/command */ "./src/command/command.ts");
const util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
const roomInfo_1 = __webpack_require__(/*! ../roomInfo */ "./src/roomInfo.ts");
/**
 * 采集者策略
 */
exports.Harvester = {
    minEnergy: util_1.GetRequiredEnergy([MOVE, WORK]),
    create(maxEnergy) {
        const count = Math.min(6, Math.floor((maxEnergy - this.minEnergy) / BODYPART_COST.work));
        const body = [MOVE, WORK];
        body.splice(0, 0, ...new Array(count).fill(WORK));
        return body;
    },
    initStrategy() {
        // TODO
    },
    start(creep) {
        FindNextTarget(creep);
    },
    callbackMap: {},
};
/**
 * 找到下一个采集目标
 * @param creep creep
 * @return 是否成功
 */
function FindNextTarget(creep) {
    const roomInfos = roomInfo_1.GetRoomInfo(creep.room);
    for (let i = 0; i < roomInfos.sourceInfo.length; i++) {
        if (roomInfos.creepInfo[i] === null) {
            const target = Game.getObjectById(roomInfos.sourceInfo[i]);
            if (target) {
                command_1.SetNextCommand("harvest" /* Harvest */, creep, target);
                roomInfos.creepInfo[i] = creep.name;
                return true;
            }
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Transferer = void 0;
const command_1 = __webpack_require__(/*! ../command/command */ "./src/command/command.ts");
const moveCache_1 = __webpack_require__(/*! ../moveCache */ "./src/moveCache.ts");
const util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
/**
 * 运输者
 */
exports.Transferer = {
    minEnergy: util_1.GetRequiredEnergy([CARRY, MOVE]),
    create(maxEnergy) {
        let rest = maxEnergy - this.minEnergy;
        const body = [CARRY, MOVE];
        if (rest >= BODYPART_COST.carry) {
            body.unshift(CARRY);
            rest -= BODYPART_COST.carry;
        }
        const count = Math.min(1, Math.floor(rest / (BODYPART_COST.carry * 2 + BODYPART_COST.move)));
        for (let i = 0; i < count; i++) {
            body.push(CARRY, CARRY, MOVE);
        }
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = moveCache_1.initMoveCache(creep);
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
                    if (creep.store.energy === 0 || !FindTransferTarget(creep)) {
                        FindPickupTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
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
                    if (creep.store.energy === 0 || !FindTransferTarget(creep)) {
                        FindPickupTarget(creep);
                    }
                    break;
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
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
    const target = util_1.RandomObjectInList(creep.room.find(FIND_DROPPED_RESOURCES));
    if (target) {
        command_1.SetNextCommand("pickup" /* Pickup */, creep, target);
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
                case STRUCTURE_TERMINAL:
                    return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            return false;
        }),
        range: 1,
    });
    if (target) {
        command_1.SetNextCommand("transfer" /* Transfer */, creep, target);
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const command_1 = __webpack_require__(/*! ../command/command */ "./src/command/command.ts");
const moveCache_1 = __webpack_require__(/*! ../moveCache */ "./src/moveCache.ts");
const util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
const __1 = __webpack_require__(/*! ../ */ "./src/index.ts");
/**
 * 采集者策略
 */
exports.Worker = {
    minEnergy: util_1.GetRequiredEnergy([MOVE, WORK, CARRY]),
    create(maxEnergy) {
        const count = Math.min(2, Math.floor(maxEnergy / (BODYPART_COST.work + BODYPART_COST.move + BODYPART_COST.carry)));
        const body = [];
        for (let i = 0; i < count; i++) {
            body.push(MOVE, WORK, CARRY);
        }
        return body;
    },
    initStrategy(creep) {
        const strategy = creep.memory.strategy;
        strategy.moveCache = moveCache_1.initMoveCache(creep);
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
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
                        FindRandomWithdrawTarget(creep);
                    }
            }
        },
        ["updateController" /* UpgradeController */]: (creep, result) => {
            const strategy = creep.memory.strategy;
            switch (result) {
                case 1 /* Moving */:
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
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
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
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
                    if (moveCache_1.checkMoveFail(creep, strategy.moveCache)) {
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
        command_1.SetNextCommand("withdraw" /* Withdraw */, creep, target);
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
    const target = util_1.RandomObjectInList(targets);
    if (target) {
        command_1.SetNextCommand("withdraw" /* Withdraw */, creep, target);
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
        command_1.SetNextCommand("build" /* Build */, creep, target);
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
        command_1.SetNextCommand("repair" /* Repair */, creep, target);
        return true;
    }
    else {
        creep.say('闲置中');
        return false;
    }
}
function FindUpgradeTarget(creep) {
    if (creep.room.controller) {
        command_1.SetNextCommand("updateController" /* UpgradeController */, creep);
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
    const indice = [0, 1, 2];
    const workers = __1.creepInfo.get("worker" /* Worker */);
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
    indice.sort((a, b) => counts[a] - counts[b]);
    for (let i = 0; i < indice.length; i++) {
        const result = fns[indice[i]](creep);
        if (result) {
            return true;
        }
    }
    return false;
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRequiredEnergy = exports.RandomObjectInList = exports.RandomInt = void 0;
/**
 * 随机整数
 * @param max 最大值
 * @param min 最小值,默认为0
 * @return 随机结果
 */
function RandomInt(max, min = 0) {
    return min + Math.floor(Math.random() * (max - min));
}
exports.RandomInt = RandomInt;
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
exports.RandomObjectInList = RandomObjectInList;
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
exports.GetRequiredEnergy = GetRequiredEnergy;


/***/ })

/******/ });
//# sourceMappingURL=main.js.map