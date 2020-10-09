import { obstacles } from './global'
import { LookForInRange } from './roomPatch'
import { Task } from './TaskCenter'

export class HarvestTask implements Task {
    sourceId: Id<Source>
    priority: number;
    targetPos: RoomPosition[]
    activeCreeps: Id<Creep>[] = []

    constructor(source: Source) {
        this.sourceId = source.id
        this.priority = 100
        const structure = LookForInRange('structure', source, 1)
            .filter(s => obstacles.has(s.structure.structureType))
        const terrain = LookForInRange('terrain', source, 1)
            .filter(t => t.terrain !== 'wall'
                && structure.every(s => s.x !== t.x && s.y !== t.y))
        this.targetPos = terrain.map(t => new RoomPosition(t.x, t.y, source.room.name))
    }

    query(creep: Creep): boolean {
        throw new Error('Method not implemented.')
    }
    assign(creep: Creep): boolean {
        throw new Error('Method not implemented.')
    }

}