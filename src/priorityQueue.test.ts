import 'mocha'
import { PriorityQueue } from './priorityQueue'

interface TestData {
    value: number
    order: number
}

interface Snapshot {
    testData: TestData[]
    queueValue: TestData[]
    queuePriority: number[]
    queueOrder: number[]
}

function GetSnapshot(queue: PriorityQueue<TestData>, testData: TestData[]): Snapshot {
    return {
        testData: testData.slice(),
        queueValue: queue['data'].slice(),
        queuePriority: queue['priority'].slice(),
        queueOrder: queue['order'].slice(),
    }
}

function CheckQueue(queue: PriorityQueue<TestData>, testList: TestData[]) {
    if (queue['data'].length !== testList.length) {
        return false
    }
    for (let i = 0; i < queue['data'].length; i++) {
        if (queue['data'][i].value !== queue['priority'][i]) {
            return false
        }
        if (queue['data'][i].order !== queue['order'][i]) {
            return false
        }
    }
    for (let i = 0; i * 2 + 1 < queue['data'].length; i++) {
        let child = i * 2 + 1
        if (child + 1 < queue['data'].length &&
            (queue['priority'][child + 1] > queue['priority'][child] ||
                (queue['priority'][child + 1] === queue['priority'][child] &&
                    queue['order'][child + 1] < queue['order'][child]))) {
            child++
        }
        if (queue['priority'][child] > queue['priority'][i]) {
            return false
        }
        if (queue['priority'][child] === queue['priority'][i]) {
            if (queue['order'][child] < queue['order'][i]) {
                return false
            }
        }

    }
    for (let i = 0; i < queue['priority'].length; i++) {
        if (typeof queue['priority'][i] !== 'number') {
            return false
        }
    }
    for (let i = 0; i < queue['order'].length; i++) {
        if (typeof queue['order'][i] !== 'number') {
            return false
        }
    }
    return true
}

const testCount = 1000000
const getPriority = () => Math.floor(Math.random() * 100)
const maxReducer = (pre: TestData, cur: TestData) => {
    if (pre.value < cur.value) {
        return cur
    } else if (pre.value > cur.value) {
        return pre
    } else {
        return pre.order < cur.order ? pre : cur
    }
}

describe('PriorityQueue', function () {
    it(`testcount:${testCount}`, function () {
        let order = 0
        const queue = new PriorityQueue<TestData>()
        const testList: TestData[] = []
        let preSnapshot: Snapshot | null = null
        let func = ''
        for (let i = 0; i < testCount; i++) {
            let hasError = false
            const rnd = Math.random()
            if (rnd < 0.25) {
                const priority = getPriority()
                const data: TestData = {
                    value: priority,
                    order: order,
                }
                func = `push priority:${priority} order:${order}`
                queue.push(data, priority)
                testList.push(data)
                order++
            } else if (rnd < 0.5) {
                func = 'pop'
                if (testList.length > 0) {
                    const max = testList.reduce(maxReducer)
                    const actual = queue.pop()!
                    const index = testList.indexOf(max)
                    testList.splice(index, 1)
                    if (max !== actual) {
                        hasError = true
                    }
                } else {
                    const out = queue.pop()
                    if (out !== null) {
                        hasError = true
                    }
                }
            } else if (rnd < 0.75) {
                if (testList.length > 0) {
                    const index = Math.floor(Math.random() * testList.length)
                    const newPriority = getPriority()
                    func = `setDataPriority index:${index} priority:${newPriority}`
                    const result = queue.setDataPriority(testList[index], newPriority)
                    if (!result) {
                        func += ' failed'
                        hasError = true
                    }
                    testList[index].value = newPriority
                    testList[index].order = order
                    order++
                }
            } else {
                if (testList.length > 0) {
                    const index = Math.floor(Math.random() * testList.length)
                    func = `cancelData index:${index}`
                    const result = queue.cancelData(testList[index])
                    if (!result) {
                        func += ' failed'
                        hasError = true
                    }
                    testList.splice(index, 1)
                }
            }
            const snapshot = GetSnapshot(queue, testList)
            if (hasError || !CheckQueue(queue, testList)) {
                hasError = true
            }
            if (hasError) {
                throw new Error(`${func}\n${JSON.stringify(preSnapshot)}\n${JSON.stringify(snapshot)}`)
            }
            preSnapshot = snapshot
        }
    })
})