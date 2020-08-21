const http = require("http");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const socketio = require("socket.io");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

io.on("connect", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("join", ({ roomId, displayName }) => {
    socket.join(roomId);
    console.log(`${displayName} joined ${roomId}`);

    io.to(roomId).emit("new-user-joined", {
      displayName,
      createdAt: Date.now(),
    });
  });

  socket.on("send-message", ({ displayName, message, roomId }) => {
    console.log("send-message", { displayName, message, roomId });
    io.to(roomId).emit("new-message", {
      displayName,
      message,
      roomId,
      createdAt: Date.now(),
    });
  });
});

module.exports = server;
