"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 3000;
let user = "";
const users = {};
const messageQueue = [];

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);
  socket.on("new-user-joined", (payload) => {
    users[socket.id] = payload;
    user = payload;
    socket.broadcast.emit("user-joined", payload);
    messageQueue ? messageQueue.forEach((message) => socket.emit("receive", message)) : null;
  });

  socket.on("send-message", (payload) => {
    socket.broadcast.emit("receive", { message: payload, id: user });
    messageQueue
      ? messageQueue.push({ message: payload, id: user })
      : (messageQueue = [{ message: payload, id: user }]);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", `${users[socket.id]} left the chat`);
    delete users[socket.id];
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
