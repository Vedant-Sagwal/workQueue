"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTask = ProcessTask;
const task_1 = require("../task/task");
function ProcessTask(taskToExecute) {
    if (taskToExecute == null) {
        return Error("Payload is Empty");
    }
    switch (taskToExecute.type) {
        case "send_email":
            setTimeout(() => {
                console.log(`Sending email to : ${taskToExecute.payload["to"]} with subject ${taskToExecute.payload["subject"]}`);
            }, 1000);
            return;
        case "resize_image":
            console.log(`Resizing image to x coordinate : ${taskToExecute.payload["new_x"]}, y coordinate : ${taskToExecute.payload["new_y"]}`);
            return;
        case "generate_pdf":
            console.log("Generating PDF..");
            return;
        case "":
            console.error("Task Type is empty");
        default:
            console.error("Unsupported Task");
    }
}
//# sourceMappingURL=worker.js.map