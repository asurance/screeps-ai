import { obstacles } from './global'
import { LookForInRange } from './util'
import { Task } from './taskCenter'

export class HarvestTask implements Task {
    sourceId: Id<Source>
    priority: number;
    maxCount: number;
    activeCreeps: string[] = []
    containerX = 0
    containerY = 0
    container: Id<StructureContainer> | null = null
    containerSite: Id<ConstructionSite> | null = null
    constructor(source: Source) {
        this.sourceId = source.id
        this.priority = 100
        const structure = LookForInRange('structure', source, 1)
            .filter(s => obstacles.has(s.structure.structureType))
        const terrain = LookForInRange('terrain', source, 1)
            .filter(t => t.terrain !== 'wall'
                && structure.every(s => s.x !== t.x && s.y !== t.y))
        source.room.createConstructionSite(terrain[0].x, terrain[0].y, STRUCTURE_CONTAINER)
        const site = source.room.lookForAt('constructionSite', terrain[0].x, terrain[0].y)
        this.containerSite = site[0].id
        this.maxCount = terrain.length
    }
    query(creep: Creep): boolean {
        throw new Error('Method not implemented.')
    }
    assign(creep: Creep): boolean {
        throw new Error('Method not implemented.')
    }

}