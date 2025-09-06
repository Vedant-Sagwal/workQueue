"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("../../internal/task/task");
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ioredis_1 = __importDefault(require("ioredis"));
const app = (0, express_1.default)();
//connect to redis
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error("REDIS URL NOT WORKING");
}
const rdb = new ioredis_1.default(redisUrl);
const port = process.env.PORT || "3000";
app.post("/enqueue", async (req, res) => {
    const task = req.body;
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
        res.send(`Task of type '${task.type}' has been successfully added to the queue`);
    }
    catch (err) {
        console.error("Redis error:", err);
        res.status(500).send("Internal server error");
    }
});
exports.default = app;
//# sourceMappingURL=main.js.map