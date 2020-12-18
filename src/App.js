import "antd/dist/antd.css";
import React, { useLayoutEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

export const config = {
  endpoint: "http://<workspace-ip>:8082/api/v1",
};

export default function App(props) {
  const location = useLocation();
  // Scroll to top if path changes
  useLayoutEffect(() => {
    window && window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
        {/* TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - To add route for /register */}




        {/* TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - To add route for /login */}

        <Route path="/">
          <Home />
        </Route>


    </div>
  );
}