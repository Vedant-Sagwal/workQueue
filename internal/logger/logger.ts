import {Task, Metrices} from "../task/task";
import fs from "fs";
import path from "path"

function getLogFilePath() : string {
    return path.join(process.cwd(), "logs.txt");
}

function LogSuccess(currTask : task) : void {
    try {
        
    }
}