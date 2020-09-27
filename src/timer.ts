const timer = new Map<number, (() => void)[]>()

export function setTimeout(callback: () => void, timeout: number): void {
    const timestamp = Game.time + timeout
    let list = timer.get(timestamp)
    if (!list) {
        list = []
        timer.set(timestamp, list)
    }
    list.push(callback)
}

export function Tick(): void {
    const list = timer.get(Game.time)
    if (list) {
        for (const callback of list) {
            callback()
        }
        timer.delete(Game.time)
    }
}

export function ClearAll(): void {
    timer.clear()
}