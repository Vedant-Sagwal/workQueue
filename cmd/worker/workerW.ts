import {Task, Metrices} from "../../internal/task/task";
import {ProcessTask} from "../../internal/worker/worker";
import {LogSuccess, LogFailure} from "../../internal/logger/logger";
import Redis from "ioredis";
import dotenv from "dotenv";
import Router, {Response, Request} from "express";

dotenv.config();

let totalJobsInQueue = 0;
let jobsDone = 0;
let jobsFailed = 0;

function connectRedis() : Redis {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error("REDIS URL not found!!");
    }
    return new Redis(redisUrl);
}

async function runWorker(rdb : Redis, workerId : number) {
    console.log(`Worker ${workerId} started`);
    while (true) {
        try {
            const res = await rdb.blpop("task_queue", 0);
            if (!res) {
                continue;
            }
            const [, taskData] = res;
            totalJobsInQueue = await rdb.llen("task_queue");
            let taskToExecute : Task;
            try {
                taskToExecute = JSON.parse(taskData);
            } catch (err) {
                console.error("Cannot parse task from Redis:", err);
                continue;
            }
            let retriesLeft = taskToExecute.retries;
            try {
                await ProcessTask(taskToExecute);
                jobsDone++;
                LogSuccess(taskToExecute);
                console.log(`Worker ${workerId}: Task done successfully`);
            } catch (err: any) {
                jobsFailed++;
                LogFailure(taskToExecute, err);
                retriesLeft--;
                console.error(
                    `Worker ${workerId}: Error processing task: ${err.message}. Putting it back in queue...`
                );
                if (retriesLeft > 0) {
                    // push back with updated retries
                    const retryTask: Task = { ...taskToExecute, retries: retriesLeft };
                    await rdb.rpush("task_queue", JSON.stringify(retryTask));
                } else {
                    console.error(
                        `Worker ${workerId}: Task failed after all retries. Dropping task.`
                    );
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

const app = Router();

app.get("/metrics", (req: Request, res: Response) => {
    res.json({
        total_jobs_in_queue: totalJobsInQueue,
        jobs_done: jobsDone,
        jobs_failed: jobsFailed,
    });
});
export default app;

