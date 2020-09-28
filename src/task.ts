import { setTimeout } from './timer'

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
    execute(creep: Creep): void {
        if (creep.pos.inRangeTo(this.target, this.range)) {
            this.onFinish?.()
        } else {
            creep.moveTo(this.target, { range: this.range })
        }
    }
    onFinish?: () => void
    onError?: () => void
}

export class HarvestTask {
    sourceId: Id<Source>
    constructor(source: Source) {
        this.sourceId = source.id
    }
    execute(creep: Creep): void {
        const source = Game.getObjectById(this.sourceId)
        if (source) {
            if (source.energy > 0) {
                creep.harvest(source)
            } else {
                this.onFinish?.()
            }
        } else {
            this.onError?.()
        }
    }
    onFinish?: () => void
    onError?: () => void
}


export class UpgradeControllerTask {
    creepId: Id<Creep>
    constructor(creep: Creep) {
        this.creepId = creep.id
    }
    execute(creep: Creep): void {
        if (creep.room.controller) {
            if (creep.store[RESOURCE_ENERGY] > 0) {
                creep.upgradeController(creep.room.controller)
            } else {
                this.onFinish?.()
            }
        } else {
            this.onError?.()
        }
    }
    onFinish?: () => void
    onError?: () => void
}

export class SpawnCreepTask {
    private creepname: string
    constructor(spawn: StructureSpawn, bodypart: BodyPartConstant[]) {
        this.creepname = `${spawn.name}-${Game.time}`
        const result = spawn.spawnCreep(bodypart, this.creepname)
        if (result === OK) {
            setTimeout(this.onSpawnFinish, bodypart.length * CREEP_SPAWN_TIME)
        } else {
            this.onError?.(result)
        }
    }
    private onSpawnFinish = () => {
        this.onFinish?.(this.creepname)
    }
    onFinish?: (creepName: string) => void
    onError?: (code: ScreepsReturnCode) => void
}