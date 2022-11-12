import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Form from "./form";

import "./messages.css";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const socket = io("http://localhost:3030");
    if (username) socket.emit("new-user-joined", username);

    socket.on("user-joined", (username) => {
      setMessages((messages) => [...messages, { message: `${username} joined the chat`, username: "Admin" }]);
    });

    socket.on("receive", (payload) => {
      setMessages((messages) => [...messages, payload]);
    });

    socket.on("user-left", (username) => {
      setMessages((messages) => [...messages, { message: `${username} left the chat`, username: "Admin" }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    const socket = io("http://localhost:3030");
    socket.emit("send-message", { message, username: username });
    setMessage("");
  };

  return (
    <div>
      {username ? (
        <div>
          <div
            className="messages-container"
            ref={(el) => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {messages.map((message, index) => (
              <div key={index}>
                {message.username === "Admin" ? (
                  <div className="admin-message">
                    <p>{message.message}</p>
                  </div>
                ) : (
                  <div className={message.username === username ? "my-message-box" : "other-message-box"}>
                    <div>
                      {messages[index - 1] && messages[index - 1].username === message.username ? null : (
                        <p className="message-username">{message.username}</p>
                      )}
                      <p className="message-text">{message.message}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Form message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
      ) : null}
    </div>
  );
}
