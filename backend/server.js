"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const users = {};
const { getMessages, receiveMessage } = require("./message-queue");

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("new-user-joined", (payload) => {
    users[socket.id] = payload;
    socket.broadcast.emit("user-joined", payload);
    getMessages(socket);
  });

  socket.on("send-message", (payload) => {
    receiveMessage(socket, payload);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) socket.broadcast.emit("user-left", users[socket.id]);

    delete users[socket.id];
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
