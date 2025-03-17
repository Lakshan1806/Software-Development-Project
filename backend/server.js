import express from "express";
import dotenv, { config } from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoute.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
import feedbackRoutes from "./routes/feedbackRoute.js";
import cookieParser from "cookie-parser";
import feedbackRoutes from "./routes/feedbackRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(cookieParser());
app.use("/admin", adminRoutes);
app.use("/feedback", feedbackRoutes);

console.log(process.env.MONGO_URI);
console.log("server is ready");

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();
  app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
  });
}

startServer();
