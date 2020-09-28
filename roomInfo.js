"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomInfoMap = void 0;
exports.RoomInfoMap = GenerateRoomInfomap();
function GenerateRoomInfomap() {
    const map = new Map();
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        map.set(room.name, { spawn: [], creep: [] });
    }
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const roomInfo = map.get(spawn.room.name);
        roomInfo.spawn.push(spawn.name);
        // TODO spawn.memory.roomname = spawn.room.name
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        const roomInfo = map.get(creep.room.name);
        roomInfo.creep.push(creep.name);
        // TODO creep.memory.roomname = creep.room.name
    }
    return map;
}
