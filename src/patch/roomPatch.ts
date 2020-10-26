import { SpawnMap } from '../globalMap'
import { obstacles } from '../util/global'
import { LookForInRange, SerializeRoomPos } from '../util/util'
import { SetTask } from '../globalTask'

global.ScanRoom = () => {
    for (const key in Game.rooms) {
        const room = Game.rooms[key]
        const sources = room.find(FIND_SOURCES)
        const sourceTasks: SourceTask[] = sources.map(source => {
            const structure = LookForInRange('structure', source, 1)
                .filter(s => obstacles.has(s.structure.structureType))
            const terrain = LookForInRange('terrain', source, 1)
                .filter(t => t.terrain !== 'wall'
                    && structure.every(s => s.x !== t.x && s.y !== t.y))
            return {
                id: source.id,
                creeps: [],
                containerPositon: SerializeRoomPos(terrain[0]),
                maxNumber: terrain.length,
            }
        })
        const spawnName = SpawnMap.get(room.name)![0]
        const spawn = Game.spawns[spawnName]
        const tasks = spawn.memory.task ?? []
        sourceTasks.forEach((source, i) => {
            const sourceTaskName = `SourceTask:${room.name}-${i}` as Id<SourceTask>
            SetTask(sourceTaskName, source)
            const spawnTask: SpawnTask = {
                body: [WORK, CARRY, MOVE],
                role: 'harvester',
                taskId: sourceTaskName,
            }
            const spawnTaskName = `SpawnTask:${Game.time}-${spawnTask.role}-${i}` as Id<SpawnTask>
            SetTask(spawnTaskName, spawnTask)
            tasks.push(spawnTaskName)
        })
        spawn.memory.task = tasks
    }
}