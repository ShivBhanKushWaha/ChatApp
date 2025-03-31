import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { app, server } from "./SocketIO/server.js";
import path from "path";
dotenv.config();
const PORT = process.env.PORT || 5000;
const URI = process.env.MongoDbURI;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend's origin
    credentials: true, // Allow credentials (cookies, headers)
  })
);
app.use("/user", userRoute);
app.use("/message", messageRouter);

mongoose
  .connect(URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error while connecting to the database", err));

// deployment code
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static("./Frontend/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirPath, "./Frontend/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
