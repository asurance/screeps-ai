interface OrderInfo {
    id: string
    price: number
    amount: number
}

export function deal(room: Room): void {
    const orders = Game.market.getAllOrders({
        type: ORDER_BUY,
        resourceType: RESOURCE_ENERGY,
    }).map(order => {
        const amount = Math.min(room.terminal!.store.energy, order.amount)
        const price = amount > 0 ? order.price * amount / (amount + Game.market.calcTransactionCost(amount, order.roomName!, room.name)) : 0
        const orderInfo: OrderInfo = {
            id: order.id,
            price,
            amount,
        }
        return orderInfo
    }).sort((a, b) => b.price - a.price)
    for (const order of orders) {
        const result = Game.market.deal(order.id, order.amount, room.name)
        if (result === OK) {
            Game.notify(`deal ${order.id} with ${order.amount} for ${order.price}`)
            break
        }
    }
}