import { GetRequiredEnergy } from '../util/util'

global.GenerateHarvester = () => {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        const body = [WORK, CARRY, MOVE]
        if (spawn.room.energyAvailable >= GetRequiredEnergy(body)) {
            const result = spawn.spawnCreep(body, `${spawn.name}-harvester-${Game.time}`, {
                memory: {
                    roomName: spawn.room.name,
                    role: '',
                }
            })
            if (result !== OK) {
                console.log(`Error: ${result}`)
            }
        } else {
            console.log('Requried more energy')
        }
    }
}