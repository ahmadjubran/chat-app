"use strict";

const messageQueue = [];

const receiveMessage = (socket, payload) => {
  try {
    messageQueue.push(payload);
    socket.broadcast.emit("receive", payload);
  } catch (error) {
    console.error(error);
  }
};

const getMessages = (socket) => {
  try {
    messageQueue.forEach((message) => {
      socket.emit("receive", message);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  receiveMessage,
  getMessages,
};
