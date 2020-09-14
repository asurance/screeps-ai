export function Upgrade(creep: Creep): boolean {
    if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller)
        }
        creep.say('升级中')
        return true
    } else {
        creep.say('闲置中')
        return false
    }
}