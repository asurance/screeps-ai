import { obstacles } from './util/global'
import { LookForInRange } from './util/util'

export class HarvestTask {
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
        if (!structure.some(s => {
            if (s.structure.structureType === STRUCTURE_CONTAINER) {
                this.container = (s.structure as StructureContainer).id
                return true
            } else {
                return false
            }
        })) {
            const result = source.room.createConstructionSite(terrain[0].x, terrain[0].y, STRUCTURE_CONTAINER)
            if (result === OK) {
                const site = source.room.lookForAt('constructionSite', terrain[0].x, terrain[0].y)
                    .filter(s => s.structureType === STRUCTURE_CONTAINER)
                this.containerSite = site[0].id
            }
        }
        this.maxCount = terrain.length
    }
}