import { SpawnMap } from '../globalMap'
import { obstacles } from '../util/global'
import { LookForInRange, SerializeRoomPos } from '../util/util'
import { SetTask } from './memoryPatch'

global.ScanRoom = () => {
    for (const key in Game.rooms) {
        const room = Game.rooms[key]
        const sources = room.find(FIND_SOURCES)
        const sourceTasks = sources.map(source => {
            const structure = LookForInRange('structure', source, 1)
                .filter(s => obstacles.has(s.structure.structureType))
            const terrain = LookForInRange('terrain', source, 1)
                .filter(t => t.terrain !== 'wall'
                    && structure.every(s => s.x !== t.x && s.y !== t.y))
            return {
                id: source.id,
                creeps: [],
                containerPositon: SerializeRoomPos(terrain[0])
            }
        })
        const spawnName = SpawnMap.get(room.name)![0]
        const spawn = Game.spawns[spawnName]
        const tasks = spawn.memory.task ?? []
        sourceTasks.forEach((source, i) => {
            const harvsetTaskName = `${room.name}-source-${i}` as Id<SourceTask>
            SetTask(harvsetTaskName, source)
            const task: SpawnTask = {
                body: [WORK, CARRY, MOVE],
                role: 'harvester',
                taskId: harvsetTaskName,
            }
            const taskName = `${Game.time}-${task.role}-${i}` as Id<SpawnTask>
            SetTask(taskName, task)
            tasks.push(taskName)
        })
        spawn.memory.task = tasks
    }
}