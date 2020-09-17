export function Upgrade(creep: Creep): number {
    if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.say('升级中')
            creep.moveTo(creep.room.controller)
            return 0
        } else {
            return -2
        }
    } else {
        creep.say('闲置中')
        return 10
    }
}