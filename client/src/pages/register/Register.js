import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { Container, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from "reactstrap";
import Widget from "../../components/Widget";
import { registerUser, registerError } from "../../actions/register";
import microsoft from "../../assets/microsoft.png";
import Login from "../login";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFetching = useSelector((store) => store.auth.isFetching);
  const errorMessage = useSelector((store) => store.auth.errorMessage);

  const doRegister = (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      checkPassword();
    } else {
      // dispatch(
      //   registerUser({
      //     creds: {
      //       email: email,
      //       password: password,
      //     },
      //     history: props.history,
      //   })
      // );
    }
  };

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changePassword = (e) => {
    setPassword(e.target.value);
  };
  const changeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isPasswordValid = () => {
    return password && password === confirmPassword;
  };

  const checkPassword = () => {
    if (!isPasswordValid()) {
      if (!password) {
        // this.props.dispatch(registerError("Password field is empty"));
      } else {
        // this.props.dispatch(registerError("Passwords are not equal"));
      }
      // setTimeout(() => {
      //   this.props.dispatch(registerError());
      // }, 3 * 1000);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Widget className="widget-auth mx-auto" title={<h3 className="mt-0">Welcome</h3>}>
          <p className="widget-auth-info">Please fill all fields below.</p>
          <form onSubmit={doRegister}>
            {errorMessage && (
              <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger">
                {errorMessage}
              </Alert>
            )}
            <FormGroup className="mt">
              <Label for="email">Email</Label>
              <InputGroup className="input-group-no-border">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="la la-user text-white" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="email"
                  className="input-transparent pl-3"
                  value={email}
                  onChange={changeEmail}
                  type="email"
                  required
                  name="email"
                  placeholder="Email"
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
                  value={password}
                  onChange={changePassword}
                  type="password"
                  required
                  name="password"
                  placeholder="Password"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm</Label>
              <InputGroup className="input-group-no-border">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="la la-lock text-white" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="confirmPassword"
                  className="input-transparent pl-3"
                  value={confirmPassword}
                  onChange={changeConfirmPassword}
                  onBlur={checkPassword}
                  type="password"
                  required
                  name="confirmPassword"
                  placeholder="Confirm"
                />
              </InputGroup>
            </FormGroup>
            <div className="bg-widget-transparent auth-widget-footer">
              <Button type="submit" color="danger" className="auth-btn" size="sm" style={{ color: "#fff" }}>
                {isFetching ? "Loading..." : "Register"}
              </Button>
              <p className="widget-auth-info mt-4">Already have the account? Login now!</p>
              <Link className="d-block text-center mb-4" to="login">
                Enter the account
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
