import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies and headers
  },
});

// real time message ke liye function
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId]
}

// Store users with userId -> socketId mapping
const users = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Fetch userId from socket query
  const userId = socket.handshake.query.userId;
  console.log("User ID connected:", userId);

  if (userId) {
    // Map userId to socket.id to track online status
    users[userId] = socket.id;
    console.log("Online users:", users);

    // Emit updated list of online users to all connected clients
    io.emit("getOnline", Object.keys(users));
  }

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);

    // Remove disconnected user from the list
    for (const [key, value] of Object.entries(users)) {
      if (value === socket.id) {
        delete users[key];
        break;
      }
    }

    // Emit updated online users list after disconnect
    io.emit("getOnline", Object.keys(users));
  });
});

export { app, io, server };
