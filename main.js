"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const timer_1 = require("./timer");
function loop() {
    // 回收多余cpu资源
    if (Game.cpu.bucket >= PIXEL_CPU_COST + 500 * 2) {
        Game.cpu.generatePixel();
    }
    // 清理过期creep
    for (const creepName in Memory.creeps) {
        if (!(creepName in Game.creeps)) {
            delete Memory.creeps[creepName];
        }
    }
    timer_1.Tick();
}
exports.loop = loop;
