import React from "react";

export default function Form({ message, setMessage, sendMessage }) {
  return (
    <div>
      <form onSubmit={sendMessage}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
