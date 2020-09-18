import { RandomObjectInList } from './util'

interface Pickupable {
    pickupId?: Id<Resource>
}
export function Pickup(creep: Creep): number {
    let target: Resource | null = null
    const memory = creep.memory as Pickupable
    if (memory.pickupId) {
        target = Game.getObjectById(memory.pickupId)
    }
    if (target === null) {
        const source = creep.room.find(FIND_DROPPED_RESOURCES)
        target = RandomObjectInList(source)
        if (target) {
            memory.pickupId = target.id
        }
    }
    if (target) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
            return -1
        } else {
            creep.say('捡起中')
            return -1
        }
    } else {
        creep.say('闲置中')
        return 10
    }
}