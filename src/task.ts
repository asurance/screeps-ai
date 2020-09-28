export interface ExecuteTask {
    tick(): boolean | null
}

const obstacles = new Set<string>(OBSTACLE_OBJECT_TYPES)
// interface Task {
//     onFinish
// }

export class CanHarvestTask {
    sourceId: Id<Source>
    targetPos: RoomPosition[]
    constructor(source: Source) {
        this.sourceId = source.id
        const top = Math.max(0, source.pos.y - 1)
        const bottom = Math.min(49, source.pos.y + 1)
        const left = Math.max(0, source.pos.x - 1)
        const right = Math.min(49, source.pos.x + 1)
        const structure = source.room.lookForAtArea('structure', top, left, bottom, right, true)
            .filter(s => obstacles.has(s.structure.structureType))
        const terrain = source.room.lookForAtArea('terrain', top, left, bottom, right, true)
            .filter(t => t.terrain !== 'wall' && structure.every(s => s.x !== t.x && s.y !== t.y))
            .sort((a, b) => a.terrain === b.terrain ? 0 : a.terrain === 'plain' ? -1 : 1)
        this.targetPos = terrain.map(t => new RoomPosition(t.x, t.y, source.room.name))
    }
}

export class MoveTask {
    target: RoomPosition
    range: number
    constructor(creep: Creep, target: RoomPosition, range: number) {
        this.target = target
        this.range = range
    }
    execute(creep: Creep): boolean {
        if (creep.pos.inRangeTo(this.target, this.range)) {
            return true
        } else {
            creep.moveTo(this.target, { range: this.range })
            return false
        }
    }
}

export class HarvestTask {
    sourceId: Id<Source>
    constructor(source: Source) {
        this.sourceId = source.id
    }
    execute(creep: Creep): boolean | null {
        const source = Game.getObjectById(this.sourceId)
        if (creep && source) {
            if (source.energy > 0) {
                creep.harvest(source)
                return false
            } else {
                return true
            }
        } else {
            return null
        }
    }
}

export class CanUpgradeControllerTask {

}

export class UpgradeControllerTask {
    creepId: Id<Creep>
    constructor(creep: Creep) {
        this.creepId = creep.id
    }
    execute(creep: Creep): boolean | null {
        if (creep.room.controller) {
            if (creep.store[RESOURCE_ENERGY] > 0) {
                creep.upgradeController(creep.room.controller)
                return false
            } else {
                return true
            }
        } else {
            return null
        }
    }
}

export class SpawnCreepTask {
    spawnId: Id<StructureSpawn>
    bodypart: BodyPartConstant[]
    constructor(spawn: StructureSpawn, bodypart: BodyPartConstant[]) {
        this.spawnId = spawn.id
        this.bodypart = bodypart
    }
    execute(spawn: StructureSpawn): boolean {
        spawn.spawnCreep(this.bodypart, `${spawn.name}-${Game.time}`)
        return true
    }
}