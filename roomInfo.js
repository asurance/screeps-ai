"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomInfo = exports.RoomInfoHandler = exports.RoomInfoMap = void 0;
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
        spawn.memory.roomName = spawn.room.name;
    }
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        const roomInfo = map.get(creep.room.name);
        roomInfo.creep.push(creep.name);
        creep.memory.roomName = creep.room.name;
    }
    return map;
}
class RoomInfoHandler {
    constructor() {
        this.infoMap = new Map();
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            this.infoMap.set(room.name, { spawn: [], creep: [] });
        }
        for (const spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName];
            const roomInfo = this.infoMap.get(spawn.room.name);
            roomInfo.spawn.push(spawn.name);
            spawn.memory.roomName = spawn.room.name;
        }
        for (const creepName in Game.creeps) {
            const creep = Game.creeps[creepName];
            const roomInfo = this.infoMap.get(creep.room.name);
            roomInfo.creep.push(creep.name);
            creep.memory.roomName = creep.room.name;
        }
    }
    update() {
        for (const creepName in Memory.creeps) {
            if (!(creepName in Game.creeps)) {
                const roomName = Memory.creeps[creepName].roomName;
                const roomInfo = this.infoMap.get(roomName);
                if (roomInfo) {
                    const index = roomInfo.creep.indexOf(creepName);
                    if (index >= 0) {
                        roomInfo.creep.splice(index, 1);
                    }
                }
                delete Memory.creeps[creepName];
            }
        }
        for (const spawnName in Memory.spawns) {
            if (!(spawnName in Game.spawns)) {
                const roomName = Memory.spawns[spawnName].roomName;
                const roomInfo = this.infoMap.get(roomName);
                if (roomInfo) {
                    const index = roomInfo.spawn.indexOf(spawnName);
                    if (index >= 0) {
                        roomInfo.spawn.splice(index, 1);
                    }
                }
                delete Memory.spawns[spawnName];
            }
        }
    }
    getRoomInfo(roomName) {
        var _a;
        return (_a = this.infoMap.get(roomName)) !== null && _a !== void 0 ? _a : null;
    }
}
exports.RoomInfoHandler = RoomInfoHandler;
exports.roomInfo = new RoomInfoHandler();
