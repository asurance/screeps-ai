/**
 * 优先级队列
 */
export class PriorityQueue<T> {
    /**
     *  数据
     */
    private data: T[] = []
    /**
     * 优先级
     */
    private priority: number[] = []
    /**
     * 顺序
     */
    private order: number[] = []
    /**
     * 当前顺序
     */
    private curOrder = 0
    /**
     * 添加数据
     * @param data 数据
     * @param priority 优先级
     */
    push(data: T, priority: number): void {
        let index = this.data.length
        while (index > 0) {
            const parent = (index - 1) >> 1
            if (this.priority[parent] < priority) {
                this.data[index] = this.data[parent]
                this.priority[index] = this.priority[parent]
            } else {
                break
            }
            index = parent
        }
        this.data[index] = data
        this.priority[index] = priority
        this.order[index] = this.curOrder
        this.curOrder++
    }
    /**
     * 取出数据
     * @return 没有数据返回null
     */
    pop(): T | null {
        if (this.data.length > 0) {
            const out = this.data[0]
            const last = this.data.pop()!
            const lastPriority = this.priority.pop()!
            const lastOrder = this.order.pop()!
            if (this.data.length > 0) {
                let index = 0
                while (index * 2 + 1 < this.data.length) {
                    let child = index * 2 + 1
                    if (child + 1 < this.data.length &&
                        (this.priority[child + 1] > this.priority[child] ||
                            (this.priority[child + 1] === this.priority[child] &&
                                this.order[child + 1] < this.order[child]))) {
                        child++
                    }
                    if (this.priority[child] > lastPriority ||
                        (this.priority[child] === lastPriority && this.order[child] < lastOrder)) {
                        this.data[index] = this.data[child]
                        this.priority[index] = this.priority[child]
                        this.order[index] = this.order[child]
                    } else {
                        break
                    }
                    index = child
                }
                this.data[index] = last
                this.priority[index] = lastPriority
                this.order[index] = lastOrder
            }
            return out
        } else {
            return null
        }
    }
    /**
     * 设置数据优先级
     * @param data 数据
     * @param priority 优先级
     * @return 没有数据返回false,并没有改变
     */
    setDataPriority(data: T, priority: number): boolean {
        let index = this.data.indexOf(data)
        if (index >= 0) {
            const order = this.curOrder
            this.curOrder++
            if (priority > this.priority[index]) {
                while (index > 0) {
                    const parent = (index - 1) >> 1
                    if (this.priority[parent] < priority) {
                        this.data[index] = this.data[parent]
                        this.priority[index] = this.priority[parent]
                        this.order[index] = this.order[parent]
                    } else {
                        break
                    }
                    index = parent
                }
                this.data[index] = data
                this.priority[index] = priority
                this.order[index] = order
            } else if (priority < this.priority[index]) {
                while (index * 2 + 1 < this.data.length) {
                    let child = index * 2 + 1
                    if (child + 1 < this.data.length &&
                        (this.priority[child + 1] > this.priority[child] ||
                            (this.priority[child + 1] === this.priority[child] &&
                                this.order[child + 1] < this.order[child]))) {
                        child++
                    }
                    if (this.priority[child] >= priority) {
                        this.data[index] = this.data[child]
                        this.priority[index] = this.priority[child]
                        this.order[index] = this.order[child]
                    } else {
                        break
                    }
                    index = child
                }
                this.data[index] = data
                this.priority[index] = priority
                this.order[index] = order
            }
            return true
        } else {
            return false
        }
    }
}