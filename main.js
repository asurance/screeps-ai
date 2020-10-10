"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const roomInfo_1 = require("./roomInfo");
const timer_1 = require("./timer");
function loop() {
    timer_1.Tick();
    roomInfo_1.roomInfo.update();
    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 500 * 2) {
        Game.cpu.generatePixel();
    }
}
exports.loop = loop;
