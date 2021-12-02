import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Row, Col, Container, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from "reactstrap";

import Widget from "../../components/Widget";
import s from "./Profile.module.scss";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFetching = useSelector((store) => store.auth.isFetching);
  const errorMessage = useSelector((store) => store.auth.errorMessage);

  const doUpdate = (e) => {
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
    <div className={s.root}>
      <h2 className="page-title">
        Form - <span className="fw-semi-bold">Profile</span>
      </h2>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">My Profile</span>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>my information</code> with email, password, group.
            </p>
            <div className={s.overFlow}>
              <form onSubmit={doUpdate}>
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
                <FormGroup className="mt">
                  <Label for="email">Group</Label>
                  <InputGroup className="input-group-no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="la la-user text-white" />
                      </InputGroupText>
                    </InputGroupAddon>
                    {/* <Input
                      id="email"
                      className="input-transparent pl-3"
                      value={email}
                      onChange={changeEmail}
                      type="email"
                      required
                      name="email"
                      placeholder="Email"
                    /> */}
                  </InputGroup>
                </FormGroup>
                <br />
                <div className="auth-widget-footer">
                  <Button type="submit" color="default" className="auth-btn" size="sm" style={{ color: "#fff" }}>
                    Update
                  </Button>
                </div>
                <br />
              </form>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
