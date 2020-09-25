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
