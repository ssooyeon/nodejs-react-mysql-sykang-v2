import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Container, Alert, Button, FormGroup, Label, InputGroup, InputGroupAddon, Input, InputGroupText } from "reactstrap";

import Widget from "../../components/Widget";
import { loginUser } from "../../actions/user";
import microsoft from "../../assets/microsoft.png";

import { authLogin } from "../../actions/auth";

export default function Login(props) {
  const initialUserState = {
    id: null,
    account: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doLogin(e);
    }
  };

  const doLogin = (e) => {
    e.preventDefault();
    dispatch(authLogin(user))
      .then((res) => {
        if (res.message !== undefined) {
          setIsLoginFailed(true);
          setErrMessage(res.message);
        } else {
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.user.token}`;
          localStorage.setItem("user", JSON.stringify(res.user));
          props.history.push("/");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="auth-page">
      <Container>
        <Widget className="widget-auth mx-auto" title={<h3 className="mt-0">Welcome</h3>}>
          <p className="widget-auth-info">Use your email to sign in.</p>
          <form onSubmit={doLogin}>
            {isLoginFailed ? (
              <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger">
                {errMessage}
              </Alert>
            ) : null}
            <FormGroup className="mt">
              <Label for="email">Email</Label>
              <InputGroup className="input-group-no-border">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="la la-user text-white" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="account"
                  className="input-transparent pl-3"
                  value={user.account}
                  onChange={handleInputChange}
                  type="text"
                  required
                  name="account"
                  placeholder="Account"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <InputGroup className="input-group-no-border">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="la la-lock text-white" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="password"
                  className="input-transparent pl-3"
                  value={user.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  type="password"
                  required
                  name="password"
                  placeholder="Password"
                />
              </InputGroup>
            </FormGroup>
            <div className="bg-widget auth-widget-footer">
              <Button type="submit" color="danger" className="auth-btn" size="sm" style={{ color: "#fff" }}>
                Login
                <span className="auth-btn-circle" style={{ marginRight: 8 }}>
                  <i className="la la-caret-right" />
                </span>
              </Button>
              <p className="widget-auth-info mt-4">Don't have an account? Sign up now!</p>
              <Link className="d-block text-center mb-4" to="register">
                Create an Account
              </Link>
              <div className="social-buttons">
                <Button color="primary" className="social-button">
                  <i className="social-icon social-google" />
                  <p className="social-text">GOOGLE</p>
                </Button>
                <Button color="success" className="social-button">
                  <i className="social-icon social-microsoft" style={{ backgroundImage: `url(${microsoft})` }} />
                  <p className="social-text" style={{ color: "#fff" }}>
                    MICROSOFT
                  </p>
                </Button>
              </div>
            </div>
          </form>
        </Widget>
      </Container>
      <footer className="auth-footer">
        {new Date().getFullYear()} &copy; Light Blue Template - React Admin Dashboard Template Made by{" "}
        <a href="https://flatlogic.com" rel="noopener noreferrer" target="_blank">
          Flatlogic LLC
        </a>
        .
      </footer>
    </div>
  );
}
