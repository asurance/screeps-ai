import { SpawnTask } from '../spawnTask'

global.GenerateHarvester = () => {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        const task: SpawnTask = {
            body: [WORK, CARRY, MOVE],
            role: 'harvester'
        }
        Memory.tasks[Game.time] = task
        if (spawn.memory.task) {
            spawn.memory.task.push(`${Game.time}`)
        } else {
            spawn.memory.task = [`${Game.time}`]
        }
    }
}