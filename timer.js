"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearAll = exports.Tick = exports.setTimeout = void 0;
const timer = new Map();
function setTimeout(callback, timeout) {
    const timestamp = Game.time + timeout;
    let list = timer.get(timestamp);
    if (!list) {
        list = [];
        timer.set(timestamp, list);
    }
    list.push(callback);
}
exports.setTimeout = setTimeout;
function Tick() {
    const list = timer.get(Game.time);
    if (list) {
        for (const callback of list) {
            callback();
        }
        timer.delete(Game.time);
    }
}
exports.Tick = Tick;
function ClearAll() {
    timer.clear();
}
exports.ClearAll = ClearAll;
