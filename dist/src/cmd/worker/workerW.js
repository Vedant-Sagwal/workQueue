"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("../../internal/task/task");
const worker_1 = require("../../internal/worker/worker");
const logger_1 = require("../../internal/logger/logger");
const ioredis_1 = require("ioredis");
const dotenv_1 = require("dotenv");
const express_1 = require("express");
dotenv_1.default.config();
let totalJobsInQueue = 0;
let jobsDone = 0;
let jobsFailed = 0;
function connectRedis() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error("REDIS URL not found!!");
    }
    return new ioredis_1.default(redisUrl);
}
async function runWorker(rdb, workerId) {
    console.log(`Worker ${workerId} started`);
    while (true) {
        try {
            const res = await rdb.blpop("task_queue", 0);
            if (!res) {
                continue;
            }
            const [, taskData] = res;
            totalJobsInQueue = await rdb.llen("task_queue");
            let taskToExecute;
            try {
                taskToExecute = JSON.parse(taskData);
            }
            catch (err) {
                console.error("Cannot parse task from Redis:", err);
                continue;
            }
            let retriesLeft = taskToExecute.retries;
            try {
                await (0, worker_1.ProcessTask)(taskToExecute);
                jobsDone++;
                (0, logger_1.LogSuccess)(taskToExecute);
                console.log(`Worker ${workerId}: Task done successfully`);
            }
            catch (err) {
                jobsFailed++;
                (0, logger_1.LogFailure)(taskToExecute, err);
                retriesLeft--;
                console.error(`Worker ${workerId}: Error processing task: ${err.message}. Putting it back in queue...`);
                if (retriesLeft > 0) {
                    // push back with updated retries
                    const retryTask = { ...taskToExecute, retries: retriesLeft };
                    await rdb.rpush("task_queue", JSON.stringify(retryTask));
                }
                else {
                    console.error(`Worker ${workerId}: Task failed after all retries. Dropping task.`);
                }
            }
        }
        catch (err) {
            console.error("Redis error in worker:", err);
            break;
        }
    }
}
const redis = connectRedis();
const port = process.env.PORT || "3000";
const numWorkers = 3;
for (let i = 0; i < numWorkers; i++) {
    runWorker(redis, i + 1); // launch workers (no blocking)
}
const app = (0, express_1.default)();
app.get("/metrics", (req, res) => {
    res.json({
        total_jobs_in_queue: totalJobsInQueue,
        jobs_done: jobsDone,
        jobs_failed: jobsFailed,
    });
});
exports.default = app;
//# sourceMappingURL=workerW.js.map