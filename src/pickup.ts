import { RandomObjectInList } from './util'

interface Pickupable extends MemoryData {
    pickupId?: Id<Resource>
}
export function Pickup(creep: Creep<Pickupable>): boolean {
    let target: Resource | null = null
    if (creep.memory.pickupId) {
        target = Game.getObjectById(creep.memory.pickupId)
    }
    if (target === null) {
        const source = creep.room.find(FIND_DROPPED_RESOURCES)
        target = RandomObjectInList(source)
        if (target) {
            creep.memory.pickupId = target.id
        }
    }
    if (target) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }
        creep.say('采集中')
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}