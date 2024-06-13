const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => res.send("API running"));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
