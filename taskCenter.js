"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCenter = void 0;
class TaskCenter {
    static PublishTask(task) {
        this.TaskQueue.push(task);
        this.TaskMap.set(this.TaskID, task);
        return this.TaskID++;
    }
    static QueryTask(creep) {
        const validTasks = this.TaskQueue.filter(task => task.query(creep));
        const topPriority = validTasks.length > 0 ?
            validTasks.reduce((pre, cur) => pre.priority > cur.priority ? pre : cur) :
            null;
        if (topPriority) {
            if (topPriority.assign(creep)) {
                const index = this.TaskQueue.indexOf(topPriority);
                this.TaskQueue.splice(index, 1);
            }
            return true;
        }
        else {
            return false;
        }
    }
    static GetTaskByID(id) {
        var _a;
        return (_a = this.TaskMap.get(id)) !== null && _a !== void 0 ? _a : null;
    }
}
exports.TaskCenter = TaskCenter;
TaskCenter.TaskMap = new Map();
TaskCenter.TaskID = 0;
TaskCenter.TaskQueue = [];
