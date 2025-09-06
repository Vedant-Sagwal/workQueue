"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSuccess = LogSuccess;
exports.LogFailure = LogFailure;
const task_1 = require("../task/task");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getLogFilePath() {
    return path_1.default.join(process.cwd(), "logs.txt");
}
function LogSuccess(currTask) {
    try {
        const logFile = getLogFilePath();
        const payloadStr = JSON.stringify(currTask.payload);
        const text = `\nSUCCESS: Task type: ${currTask.type} ` +
            `Task payload: ${payloadStr} ` +
            `Retries left: ${currTask.retries}`;
        fs_1.default.appendFileSync(logFile, text, { encoding: "utf-8" });
        console.log("Successfully Logged!!");
    }
    catch (err) {
        console.error("Error Logging Success!!", err);
    }
}
function LogFailure(currTask, currErr) {
    try {
        const logFile = getLogFilePath();
        const payloadStr = JSON.stringify(currTask.payload);
        const text = `\nFAILURE: Task type: ${currTask.type} ` +
            `Task payload: ${payloadStr} ` +
            `Retries left: ${currTask.retries} ` +
            `Error message: ${currErr.message}`;
        fs_1.default.appendFileSync(logFile, text, { encoding: "utf-8" });
        console.log("Logged Failure to file");
    }
    catch (err) {
        console.error("Error Logging Failure!!", err);
    }
}
//# sourceMappingURL=logger.js.map