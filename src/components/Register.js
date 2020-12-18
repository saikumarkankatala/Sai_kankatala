import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";

/**
 * @class Register component handles the Register page UI and functionality
 * Contains the following fields
 * @property {boolean} state.loading Indicates background action pending completion. When true, further UI actions might be blocked
 * @property {string} state.username User given field for username
 * @property {string} state.password User given field for password
 * @property {string} state.confirmPassword User given field for retyping and confirming password
 */
class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
      confirmPassword: "",
    };
  }
  /**
   * Definition for register handler
   * This is the function that is called when the user clicks on the register button or submits the register form
   *    - Display an alert message, "Register logic not implemented yet"
   */
  register = async () => {
    message.info("Register logic not implemented yet");
  };

  /**
   * JSX and HTML goes here
   * We require a text field, a password field, and a confirm password field (each with data binding to state), and a submit button that calls register()
   */
  render() {
    // Ant design library supports dynamic data binding and validation as in-built features in their components.
    // We're not using those features here intentionally to allow better learning of React constructs
    return (
      <>
        <Header history={this.props.history} />
        <div className="flex-container">
          <div className="register-container container">
            <h1>Make an account</h1>
            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />
            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Add a placeholder text, "Password" to the input bar
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />
            <Input.Password
              className="input-field"
              // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Add a lock icon to the input bar (check how the "Password" input bar is rendered)
              placeholder="Confirm Password"
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />
            <Button
              loading={this.state.loading}
              type="primary"
              // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Add an event handler which calls the "register()" function when the button is clicked
            >
              Register
            </Button>
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Register);