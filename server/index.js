import express from "express";
import cors from "cors";

import { configDotenv } from "dotenv";
import connectToDb from "./config/db.js";
import analysisRouter from "./routes/analysis.route.js";
const app = express();

configDotenv();
app.use(cors());
app.use(express.json());

app.use("/api", analysisRouter);

app.listen(process.env.PORT, () => {
  connectToDb();
  console.log("Listening to port " + process.env.PORT);
});
