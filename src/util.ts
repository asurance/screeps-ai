import { creepInfo } from '.'

/**
 * 随机整数
 * @param max 最大值
 * @param min 最小值,默认为0
 * @return 随机结果
 */
export function RandomInt(max: number, min = 0): number {
    return min + Math.floor(Math.random() * (max - min))
}

/**
 * 在列表中随机一个元素
 * @param list 列表
 * @return 列表长度为0,返回null,反之返回随机的元素
 */
export function RandomObjectInList<T>(list: T[]): T | null {
    if (list.length > 0) {
        return list[Math.floor(Math.random() * list.length)]
    } else {
        return null
    }
}

/**
 * 获取对应组件所需的能量
 * @param body 组件列表
 * @return 所及能量
 */
export function GetRequiredEnergy(body: BodyPartConstant[]): number {
    return body.reduce((pre, cur) => {
        return pre + BODYPART_COST[cur]
    }, 0)
}

