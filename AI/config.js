"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
/**
 * 默认配置
 */
const defualtConfig = {
    notifyInterval: 24 * 60,
    harvester: 2,
    transferer: 8,
    worker: 5,
};
/**
 * 项目采用配置
 */
exports.config = Memory.config ? Object.assign(Object.assign({}, defualtConfig), Memory.config) : defualtConfig;
