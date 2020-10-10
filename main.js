"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const roomInfoHandler_1 = require("./roomInfoHandler");
const timer_1 = require("./timer");
function loop() {
    timer_1.Tick();
    roomInfoHandler_1.roomInfoHandler.update();
    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 500 * 2) {
        Game.cpu.generatePixel();
    }
}
exports.loop = loop;
