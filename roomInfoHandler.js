"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomInfoHandler = exports.RoomInfoHandler = void 0;
class RoomInfoHandler {
    constructor() {
        this.infoMap = new Map();
        this.creepDeadCB = new Map();
        this.spawnDeadCB = new Map();
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
                const cblist = this.creepDeadCB.get(creepName);
                if (cblist) {
                    cblist.forEach(f => f());
                    this.creepDeadCB.delete(creepName);
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
                const cblist = this.spawnDeadCB.get(spawnName);
                if (cblist) {
                    cblist.forEach(f => f());
                    this.creepDeadCB.delete(spawnName);
                }
                delete Memory.spawns[spawnName];
            }
        }
    }
    getRoomInfo(roomName) {
        var _a;
        return (_a = this.infoMap.get(roomName)) !== null && _a !== void 0 ? _a : null;
    }
    onCreepDead(creepName, cb) {
        const cblist = this.creepDeadCB.get(creepName);
        if (cblist) {
            cblist.push(cb);
        }
        else {
            this.creepDeadCB.set(creepName, [cb]);
        }
    }
    onSpawnDead(spawnName, cb) {
        const cblist = this.spawnDeadCB.get(spawnName);
        if (cblist) {
            cblist.push(cb);
        }
        else {
            this.creepDeadCB.set(spawnName, [cb]);
        }
    }
}
exports.RoomInfoHandler = RoomInfoHandler;
exports.roomInfoHandler = new RoomInfoHandler();
