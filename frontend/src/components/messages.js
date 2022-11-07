import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Form from "./form";

export default function Messages() {
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3030");
    const id = uuidv4();
    setUserId(id);
    socket.emit("new-user-joined", id);

    socket.on("user-joined", (payload) => {
      setUserId(payload);
    });

    socket.on("receive", (payload) => {
      setMessages((messages) => [...messages, payload]);
    });

    socket.on("left", (payload) => {
      setMessages((messages) => [...messages, payload]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const socket = io("http://localhost:3030");
    socket.emit("send-message", message);
    setMessage("");
  };

  return (
    <div>
      <h3>Your ID: {userId}</h3>
      <h1>Messages</h1>
      <Form message={message} setMessage={setMessage} sendMessage={sendMessage} />
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <h3>ID: {message.id}</h3>
            <p>message: {message.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
