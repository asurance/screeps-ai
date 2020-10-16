import { SourceMapConsumer } from 'source-map'

/**
 * source map 消费缓存
 */
let getConsumer = () => {
    const consumer = new SourceMapConsumer(require('main.js.map'))
    getConsumer = () => consumer
    return consumer
}

/**
 * 错误缓存
 */
const cache: { [key: string]: string } = {}

/**
 * 追踪Error调用
 * @param error 错误
 */
function SourceMappedStackTrace(error: Error): string {
    if (!error.stack) return ''
    if (error.stack in cache) return cache[error.stack]
    // eslint-disable-next-line no-useless-escape
    const re = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm
    let match: RegExpExecArray | null = re.exec(error.stack)
    let stackInfo = error.message
    while (match) {
        if (match[2] !== 'main') break
        const pos = getConsumer().originalPositionFor({
            column: parseInt(match[4], 10),
            line: parseInt(match[3], 10)
        })
        if (!pos.line) break
        const positionInfo = pos.name ? pos.name : (match[1] ? match[1] : '')
        stackInfo += `\n    at ${positionInfo} (${pos.source}:${pos.line}:${pos.column})`
        match = re.exec(error.stack)
    }
    return stackInfo
}

/**
 * 包Loop
 */
export function WrapLoop(loop: () => void): () => void {
    return () => {
        try {
            loop()
        } catch (e) {
            if (e instanceof Error) {
                const message = Game.rooms.sim ?
                    `沙盒模式无法使用source-map - 显示原始追踪栈<br>${_.escape(e.stack)}` :
                    `${_.escape(SourceMappedStackTrace(e))}`
                console.log(message)
            } else {
                throw e
            }
        }
    }
}