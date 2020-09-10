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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _walker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./walker */ "./src/walker.ts");

let count = 0;
for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    if (creep.memory.type === 'worker') {
        const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (target) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        count++;
    }
    else if (creep.memory.type === _walker__WEBPACK_IMPORTED_MODULE_0__["Walker"].type) {
        _walker__WEBPACK_IMPORTED_MODULE_0__["Walker"].count++;
        _walker__WEBPACK_IMPORTED_MODULE_0__["Walker"].tick(creep, creep.room);
    }
}
for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    if (!spawn.spawning && spawn.store['energy'] >= 200) {
        if (_walker__WEBPACK_IMPORTED_MODULE_0__["Walker"].count > 0) {
            const name = `worker_${count}`;
            const result = spawn.spawnCreep(['work', 'move'], `worker_${count}`);
            if (result === OK) {
                Memory.creeps[name].type = 'worker';
            }
            else {
                console.log(result);
            }
        }
        else {
            const result = _walker__WEBPACK_IMPORTED_MODULE_0__["Walker"].create(spawn, spawn.room);
            if (result !== OK) {
                console.log(result);
            }
        }
    }
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
const Walker = {
    count: 0,
    type: "Walker" /* Walker */,
    create(spawn, room) {
        const result = spawn.spawnCreep(['move'], 'walker');
        if (result === OK) {
            Memory.creeps['walker'].type = "Walker" /* Walker */;
        }
        Memory.creeps['walker'].direction = getNextDirection(spawn.pos, room);
        return result;
    },
    tick(creep, room) {
        let direction;
        if (canMove(creep.pos, creep.memory.direction, room)) {
            direction = creep.memory.direction;
        }
        else {
            direction = getNextDirection(creep.pos, room);
            creep.memory.direction = direction;
        }
        creep.move(direction);
    }
};
function canMove(pos, dir, room) {
    let dx = 0;
    let dy = 0;
    switch (dir) {
        case LEFT:
        case TOP_LEFT:
        case BOTTOM_LEFT:
            dx = -1;
            break;
        case RIGHT:
        case TOP_RIGHT:
        case BOTTOM_RIGHT:
            dx = 1;
            break;
    }
    switch (dir) {
        case TOP:
        case TOP_LEFT:
        case TOP_RIGHT:
            dy = -1;
            break;
        case BOTTOM:
        case BOTTOM_LEFT:
        case BOTTOM_RIGHT:
            dy = 1;
            break;
    }
    return validPosition(pos.x + dx, pos.y + dy, room);
}
function getNextDirection(pos, room) {
    const dx = [0, 1, 1, 1, 0, -1, -1, -1];
    const dy = [-1, -1, 0, 1, 1, 1, 0, -1];
    const indice = [0, 1, 2, 3, 4, 5, 6, 7];
    const ok = indice.filter(i => {
        return validPosition(dx[i] + pos.x, dy[i] + pos.y, room);
    });
    return (TOP + ok[Math.random() * ok.length]);
}
function validPosition(x, y, room) {
    if (x >= 0 && x < 50 && y >= 0 && y < 50) {
        const result = room.lookAt(x, y);
        if (result.every(r => r.terrain !== 'wall')) {
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


/***/ })

/******/ });
//# sourceMappingURL=main.js.map