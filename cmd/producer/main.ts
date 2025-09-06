import { Task, Metrices } from "../../internal/task/task"
import Router, {Request, Response} from "express";
import dotenv from "dotenv";
import Redis from "ioredis";

const app = Router();

//connect to redis
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error("REDIS URL NOT WORKING");
}

const rdb = new Redis(redisUrl);
const port = process.env.PORT || "3000";

app.post("/enqueue", async(req : Request, res : Response) => {
    const task : Task = req.body;
    if (!task || !task.type) {
        return res.status(400).send("Bad Request, Task type not defined!!");
    }
    if (task.type === "send_email") {
        if (!task.payload?.to || !task.payload?.subject) {
            return res
            .status(400)
            .send("Bad request, pass 'to' and 'subject' fields inside payload");
        }
    }

    try {
        const taskString = JSON.stringify(task);
        const queueLength = await rdb.rpush("task_queue", taskString);

        console.log("Length of Queue : ", queueLength);
        res.send(
            `Task of type '${task.type}' has been successfully added to the queue`
        );
    } catch (err) {
        console.error("Redis error:", err);
        res.status(500).send("Internal server error");
    }
})

export default app;