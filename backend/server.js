import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoute.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
import feedbackRoutes from "./routes/feedbackRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import locationRoutes from "./routes/locationRoute.js";
import { createServer } from "http";
import initializeSocket from "./utils/socketServer.js";
import RideRoute from "./routes/locationRoute.js"

import session from "express-session";
import authRouter from "./routes/authRoutes.js";
import passport from "passport";
import MongoStore from "connect-mongo";
import "./config/passport.js";
dotenv.config();

if (!process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error(" Missing SESSION_SECRET or MONGO_URI in .env file");
  process.exit(1);
}

const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

// Express middleware setup

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: MongoStore.create({ // Add session store
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions'
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth/", authRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Cookie parser and routes
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
console.log(path.join(__dirname, "/uploads"));

app.use(cookieParser());
app.use("/admin", adminRoutes);
app.use("/feedback", feedbackRoutes);

app.use(express.urlencoded({ extended: false }));
app.use("/location", locationRoutes);

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/rideRoute",RideRoute);

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();
  
  httpServer.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
    //console.log("WebSocket server ready for communication");
  });
}

startServer();