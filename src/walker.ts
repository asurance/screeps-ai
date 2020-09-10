export const Walker: ICreep = {
    count: 0,
    type: CreepType.Walker,
    create(spawn: StructureSpawn, room: Room) {
        const result = spawn.spawnCreep(['move'], 'walker')
        if (result === OK) {
            Memory.creeps['walker'].type = CreepType.Walker
        }
        Memory.creeps['walker'].direction = getNextDirection(spawn.pos, room)
        return result
    },
    tick(creep: Creep, room: Room) {
        let direction: DirectionConstant
        if (canMove(creep.pos, creep.memory.direction, room)) {
            direction = creep.memory.direction
        } else {
            direction = getNextDirection(creep.pos, room)
            creep.memory.direction = direction
        }
        creep.move(direction)
    }
}

function canMove(pos: RoomPosition, dir: DirectionConstant, room: Room): boolean {
    let dx = 0
    let dy = 0
    switch (dir) {
        case LEFT:
        case TOP_LEFT:
        case BOTTOM_LEFT:
            dx = -1
            break
        case RIGHT:
        case TOP_RIGHT:
        case BOTTOM_RIGHT:
            dx = 1
            break
    }
    switch (dir) {
        case TOP:
        case TOP_LEFT:
        case TOP_RIGHT:
            dy = -1
            break
        case BOTTOM:
        case BOTTOM_LEFT:
        case BOTTOM_RIGHT:
            dy = 1
            break
    }
    return validPosition(pos.x + dx, pos.y + dy, room)
}

function getNextDirection(pos: RoomPosition, room: Room): DirectionConstant {
    const dx = [0, 1, 1, 1, 0, -1, -1, -1]
    const dy = [-1, -1, 0, 1, 1, 1, 0, -1]
    const indice = [0, 1, 2, 3, 4, 5, 6, 7]
    const ok = indice.filter(i => {
        return validPosition(dx[i] + pos.x, dy[i] + pos.y, room)
    })
    return (TOP + ok[Math.random() * ok.length]) as DirectionConstant
}

function validPosition(x: number, y: number, room: Room): boolean {
    if (x >= 0 && x < 50 && y >= 0 && y < 50) {
        const result = room.lookAt(x, y)
        if (result.every(r => r.terrain !== 'wall')) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}