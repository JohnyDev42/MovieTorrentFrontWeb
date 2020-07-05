import React, { useState, useEffect } from "react";
import API from "../api-service";
import { useCookies } from "react-cookie";
import "../App.css";
import Button from "react-bootstrap/Button";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useCookies(["mr-token"]);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    console.log(token);
    if (token["mr-token"]) window.location.href = "/movies/";
  }, [token]);

  const loginClicked = () => {
    API.loginUser({ username, password })
      .then((resp) => setToken("mr-token", resp.token))
      .catch((error) => console.log(error));
  };
  const registerClicked = () => {
    API.registerUser({ username, password })
      .then(() => loginClicked())
      .catch((error) => console.log(error));
  };
  return (
    <div className="App">
      <header className="App-header">
        {isLoginView ? <h1>Login</h1> : <h1>Register</h1>}
      </header>
      <div className="login-container">
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(evt) => setUsername(evt.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        <br />
        <br />
        {isLoginView ? (
          <div className="text-center">
            <Button size="sm" onClick={loginClicked} variant="success">
              Login
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button variant="primary" size="sm" onClick={registerClicked}>
              Register
            </Button>
          </div>
        )}

        <br />
        {isLoginView ? (
          <p onClick={() => setIsLoginView(false)}>
            You dont have an account? Register Here
          </p>
        ) : (
          <p onClick={() => setIsLoginView(true)}>
            You already have an account? Login Here
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
