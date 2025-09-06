import express from "express"
import workerRouter from "./cmd/worker/workerW";
import producerRouter from "./cmd/producer/main";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/api", workerRouter);
app.use("/api", producerRouter);

app.get("/", (req, res) => {
    res.redirect("/api");
})

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
})