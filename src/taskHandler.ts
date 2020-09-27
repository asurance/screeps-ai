interface Task {
    tick(): boolean
}

class MoveTask {
    creepId: Id<Creep>
    sourceId: Id<Source>
    range: number
    constructor(creep: Creep, source: Source, range: number) {
        this.creepId = creep.id
        this.sourceId = source.id
        this.range = range
    }
    tick(): boolean | null {
        const creep = Game.getObjectById(this.creepId)
        const source = Game.getObjectById(this.sourceId)
        if (creep && source) {
            if (creep.pos.inRangeTo(source, this.range)) {
                return true
            } else {
                creep.moveTo(source, { range: this.range })
                return false
            }
        } else {
            return null
        }
    }
}

class HarvestTask {
    creepId: Id<Creep>
    sourceId: Id<Source>
    constructor(creep: Creep, source: Source) {
        this.creepId = creep.id
        this.sourceId = source.id
    }
    tick(): boolean | null {
        const creep = Game.getObjectById(this.creepId)
        const source = Game.getObjectById(this.sourceId)
        if (creep && source) {
            if (source.energy > 0) {
                creep.harvest(source)
                return false
            } else {
                return true
            }
        }
        return null
    }
}

