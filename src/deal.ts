interface OrderInfo {
    id: string
    price: number
    amount: number
}

export function deal(): void {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName]
        if (room.terminal && room.terminal.store.energy > 0) {
            const orderTree: OrderInfo[] = []
            Game.market.getAllOrders({
                type: ORDER_BUY,
                resourceType: RESOURCE_ENERGY,
            }).forEach(order => {
                const amount = Math.min(room.terminal!.store.energy, order.remainingAmount)
                const price = amount > 0 ? order.price * amount / (amount + Game.market.calcTransactionCost(amount, order.roomName!, room.name)) : 0
                const orderInfo: OrderInfo = {
                    id: order.id,
                    price,
                    amount,
                }
                PushTree(orderTree, orderInfo)
            })
            let count = 0
            let o = PopTree(orderTree)
            let rest = room.terminal.store.energy
            while (count < 10 && o) {
                if (rest > 0) {
                    const sell = Math.min(rest, o.amount)
                    Game.market.deal(o.id, sell, room.name)
                    rest -= sell
                } else {
                    break
                }
                count++
                o = PopTree(orderTree)
            }
        }
    }
}

export function PushTree<T extends { price: number }>(tree: T[], node: T): void {
    let target = tree.length
    while (target > 0) {
        const parent = Math.floor((target - 1) / 2)
        if (tree[parent].price < node.price) {
            target = parent
        } else {
            break
        }
    }
    tree[target] = node
}
export function PopTree<T extends { price: number }>(tree: T[]): T | null {
    if (tree.length > 0) {
        if (tree.length === 1) {
            return tree.pop()!
        } else {
            const max = tree[0]
            const last = tree.pop()!
            let target = 0
            while (target * 2 + 1 < tree.length) {
                let child = target * 2 + 1
                if (tree[child + 1].price > tree[child].price) {
                    child++
                }
                if (tree[child].price > last.price) {
                    target = child
                } else {
                    break
                }
            }
            tree[target] = last
            return max
        }
    } else {
        return null
    }
}