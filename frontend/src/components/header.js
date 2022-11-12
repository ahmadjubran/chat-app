import React from "react";
import { v4 as uuidv4 } from "uuid";

import "./messages.css";

export default function Header() {
  const login = (e) => {
    e.preventDefault();
    localStorage.setItem("username", e.target.username.value);
    localStorage.setItem("id", uuidv4());
    window.location.reload();
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    window.location.reload();
  };

  return (
    <div className="header">
      <h1>Chat App</h1>

      {localStorage.getItem("username") ? (
        <div className="logout">
          <p>welcome {localStorage.getItem("username")}</p>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={login} className="login">
          <input type="text" name="username" placeholder="Enter your username" className="login-input" />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      )}
    </div>
  );
}
