import { Server } from "socket.io";

let io;
const users = {};

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    socket.on("register-user", (userId) => {
      users[socket.id] = { userId };
      console.log(`Registered user: ${userId}`);
      broadcastActiveUsers();
    });

    socket.on("call-user", ({ to, from, offer }) => {
      const targetSocketId = getSocketIdByUserId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-made", { from, offer });
      }
    });

    socket.on("make-answer", ({ to, answer }) => {
      const targetSocketId = getSocketIdByUserId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("answer-made", { answer });
      }
    });

    socket.on("reject-call", ({ to }) => {
      const targetSocketId = getSocketIdByUserId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-rejected");
      }
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      const targetSocketId = getSocketIdByUserId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", { candidate });
      }
    });

    socket.on("send-message", ({ to, from, message, timestamp }) => {
      const targetSocketId = getSocketIdByUserId(to);
      const msg = { from, message, timestamp };

      if (targetSocketId) {
        io.to(targetSocketId).emit("receive-message", msg);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
      delete users[socket.id];
      broadcastActiveUsers();
    });
  });
}

function broadcastActiveUsers() {
  const activeUsers = Object.entries(users).map(([socketId, { userId }]) => ({
    id: userId,
    socketId,
  }));
  io.emit("active-users", activeUsers);
}

function getSocketIdByUserId(userId) {
  return Object.keys(users).find(
    (socketId) => users[socketId].userId === userId
  );
}

export default initializeSocket;
