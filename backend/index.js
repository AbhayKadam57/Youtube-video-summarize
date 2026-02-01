import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import axios from "axios"
import SummaryRouter from "./routes/SummaryRoute.js"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welocome to Youtube API summrize");
});

app.use("/api", SummaryRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});