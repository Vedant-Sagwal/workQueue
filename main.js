"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workerW_1 = __importDefault(require("./cmd/worker/workerW"));
const main_1 = __importDefault(require("./cmd/producer/main"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
app.use("/api", workerW_1.default);
app.use("/api", main_1.default);
app.get("/", (req, res) => {
    res.redirect("/api");
});
app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});
//# sourceMappingURL=main.js.map