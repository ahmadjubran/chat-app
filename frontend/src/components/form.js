import React from "react";
import "./messages.css";

export default function Form({ message, setMessage, sendMessage }) {
  return (
    <div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="message-button">
          Send
        </button>
      </form>
    </div>
  );
}
