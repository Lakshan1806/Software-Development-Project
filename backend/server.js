import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoute.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
import feedbackRoutes from "./routes/feedbackRoute.js";
import cookieParser from "cookie-parser";
import historyRoutes from "./routes/historyRoutes.js";
import { emailRoutes } from "./routes/email.js";
import promoRoutes from "./routes/promoRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import messageRoutes from "./routes/messageRoutes.js";  // Import messageRoutes

dotenv.config();

if (!process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error("Missing SESSION_SECRET or MONGO_URI in .env file");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/auth/", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/promo", promoRoutes);

// Use messageRoutes for API messages
app.use("/api/messages", messageRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
console.log(path.join(__dirname, "/uploads"));

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("send-message", ({ roomId, senderId, message }) => {
    const msgData = { senderId, message, timestamp: new Date() };
    io.to(roomId).emit("receive-message", msgData);
  });

  socket.on("call-user", (data) => {
    io.to(data.to).emit("call-made", {
      offer: data.offer,
      socket: socket.id,
    });
  });

  socket.on("make-answer", (data) => {
    io.to(data.to).emit("answer-made", {
      answer: data.answer,
      socket: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();
  server.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
  });
}

startServer();
