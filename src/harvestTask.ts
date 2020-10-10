import { obstacles } from './global'
import { LookForInRange } from './util'
import { Task } from './taskCenter'

export class HarvestTask implements Task {
    sourceId: Id<Source>
    priority: number;
    maxCount: number;
    activeCreeps: Id<Creep>[] = []

    constructor(source: Source) {
        this.sourceId = source.id
        this.priority = 100
        const structure = LookForInRange('structure', source, 1)
            .filter(s => obstacles.has(s.structure.structureType))
        const terrain = LookForInRange('terrain', source, 1)
            .filter(t => t.terrain !== 'wall'
                && structure.every(s => s.x !== t.x && s.y !== t.y))
        this.maxCount = terrain.length
    }

    query(creep: Creep): boolean {
        throw new Error('Method not implemented.')
    }

    assign(creep: Creep): boolean {
        throw new Error('Method not implemented.')
    }

}