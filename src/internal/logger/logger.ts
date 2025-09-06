import {Task, Metrices} from "../task/task";
import fs from "fs";
import path from "path"

function getLogFilePath() : string {
    return path.join(process.cwd(), "logs.txt");
}

export function LogSuccess(currTask : Task) : void {
    try {
        const logFile = getLogFilePath();
        const payloadStr = JSON.stringify(currTask.payload);
        const text =
        `\nSUCCESS: Task type: ${currTask.type} ` +
        `Task payload: ${payloadStr} ` +
        `Retries left: ${currTask.retries}`;
        fs.appendFileSync(logFile, text, {encoding : "utf-8"});
        console.log("Successfully Logged!!");
    }
    catch(err) {
        console.error("Error Logging Success!!", err);
    }
}
export function LogFailure(currTask : Task, currErr : Error) : void {
    try {
        const logFile = getLogFilePath();
        const payloadStr = JSON.stringify(currTask.payload);
        const text =
        `\nFAILURE: Task type: ${currTask.type} ` +
        `Task payload: ${payloadStr} ` +
        `Retries left: ${currTask.retries} ` +
        `Error message: ${currErr.message}`; 
        fs.appendFileSync(logFile, text, {encoding : "utf-8"});
        console.log("Logged Failure to file");
    }
    catch(err) {
        console.error("Error Logging Failure!!", err);
    }
}