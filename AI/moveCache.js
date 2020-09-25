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
