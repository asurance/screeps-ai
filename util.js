"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRequiredEnergy = exports.RandomObjectInList = exports.RandomInt = void 0;
/**
 * 随机整数
 * @param max 最大值
 * @param min 最小值,默认为0
 * @return 随机结果
 */
function RandomInt(max, min = 0) {
    return min + Math.floor(Math.random() * (max - min));
}
exports.RandomInt = RandomInt;
/**
 * 在列表中随机一个元素
 * @param list 列表
 * @return 列表长度为0,返回null,反之返回随机的元素
 */
function RandomObjectInList(list) {
    if (list.length > 0) {
        return list[Math.floor(Math.random() * list.length)];
    }
    else {
        return null;
    }
}
exports.RandomObjectInList = RandomObjectInList;
/**
 * 获取对应组件所需的能量
 * @param body 组件列表
 * @return 所及能量
 */
function GetRequiredEnergy(body) {
    return body.reduce((pre, cur) => {
        return pre + BODYPART_COST[cur];
    }, 0);
}
exports.GetRequiredEnergy = GetRequiredEnergy;
