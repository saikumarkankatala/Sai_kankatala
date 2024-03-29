import { Button } from "antd";
import React from "react";
import { Link,Route } from "react-router-dom";
import Home from "./Home";
import "./Home.css";
import Register from "./Register";
import Login from "./Login";
import "./Home.css";

export default function App() {
  return (
    <>
      {/* Display "Home" page content */}
      <div className="flex-container">
        <div className="home-container container">
          <h1 className="home-welcome-text">
            Welcome to <img src="icon.svg" alt="QKart"></img>
          </h1>

          <p>Please select an option from below</p>

          <div className="home-buttons">
            <Link to="/register">
              <Button id="register-button" className="btn-block" type="primary" block={true}>
                Register
              </Button>
            </Link>
            <Link to="/login">
                <Button id="login-button" className="btn-block" type="primary" block={true}>
                  Login
                </Button>
              </Link>

            
            <Link to="/products">
              <Button className="btn-block" type="primary" block={true}>
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
