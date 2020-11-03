import { CreepMap, SpawnMap } from '../globalMap'
import { obstacles } from '../util/global'
import { DefineGlobalCmd, LookForInRange, SerializeRoomPos } from '../util/util'
import { SetTask } from '../globalTask'

interface Stats {
    gcl: number
    gclLevel: number
    gpl: number
    gplLevel: number
    cpu: number
    bucket: number
    credit: number
}

interface RoomStats {
    name: string
    level: number
    progress: number
}

export function GlobalPatch(): void {
    DefineGlobalCmd('scan', () => {
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
                    creep: '',
                    containerPositon: SerializeRoomPos(terrain[0]),
                }
            })
            room.memory.sources = sourceTasks.map((s, i) => {
                const taskId = `Source: ${room}-${i}` as Id<SourceTask>
                SetTask(taskId, s)
                return taskId
            })
            room.memory.requireRole = {
                harvester: sourceTasks.length
            }
        }
    })
    DefineGlobalCmd('stats', () => {
        const stats: Stats = {
            gcl: Math.floor(Game.gcl.progress / Game.gcl.progressTotal * 100),
            gclLevel: Game.gcl.level,
            gpl: Math.floor(Game.gpl.progress / Game.gpl.progressTotal * 100),
            gplLevel: Game.gpl.level,
            cpu: Game.cpu.getUsed(),
            bucket: Game.cpu.bucket,
            credit: Game.market.credits,
        }
        console.log(JSON.stringify(stats, undefined, 4))
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName]
            if (room.controller) {
                const roomStats: RoomStats = {
                    name: roomName,
                    level: room.controller.level,
                    progress: Math.floor(room.controller.progress / room.controller.progressTotal * 100)
                }
                console.log(JSON.stringify(roomStats, undefined, 4))
            }
        }
    })
    DefineGlobalCmd('SpawnMap', () => {
        SpawnMap.forEach((spawns, room) => {
            console.log(room, JSON.stringify(spawns))
        })
    })
    DefineGlobalCmd('CreepMap', () => {
        CreepMap.forEach((spawns, room) => {
            console.log(room, JSON.stringify(spawns))
        })
    })
}
