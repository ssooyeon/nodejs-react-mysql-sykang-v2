import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { Container, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from "reactstrap";
import Widget from "../../components/Widget";
import { registerUser, registerError } from "../../actions/register";
import microsoft from "../../assets/microsoft.png";
import Login from "../login";

import { retrieveByAccount, createUser } from "../../actions/users";

export default function Register(props) {
  const initialUserState = {
    account: "",
    email: "",
    password: "",
    passwordCheck: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [checkDoneAccount, setCheckDoneAccount] = useState(""); // 중복확인을 완료한 계정 이름

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isShowErrAlert, setIsShowErrAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const dispatch = useDispatch();

  // input 값 변경 시 user state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // password check input에서 엔터 클릭 시 회원가입 수행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doRegister(e);
    }
  };

  // 계정 중복확인
  const checkAccount = () => {
    const account = user.account;
    if (account !== "") {
      dispatch(retrieveByAccount(account))
        .then((res) => {
          // 이미 존재하는 계정일 때
          if (res !== "" && res !== undefined) {
            setIsShowErrAlert(true);
            setIsShowSuccessAlert(false);
            setErrMessage("This account already exist.");
          } else {
            // 계정 중복 여부 확인 완료
            setIsShowSuccessAlert(true);
            setIsShowErrAlert(false);
            setSuccessMessage("This account is available.");

            setCheckDoneAccount(account);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const checkPassword = () => {
    if (!isPasswordValid()) {
      setIsShowErrAlert(true);
      setIsShowSuccessAlert(false);
      if (!user.password) {
        setErrMessage("Password field is empty.");
      } else {
        setErrMessage("Passwords are not equal.");
      }
    }
  };

  const isPasswordValid = () => {
    return user.password && user.password === user.passwordCheck;
  };

  // 회원가입
  const doRegister = (e) => {
    e.preventDefault();
    // 중복확인을 완료한 계정과 현재 input의 계정명이 같을 때
    if (checkDoneAccount === user.account) {
      dispatch(createUser(user))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Register successfully. Go to the login page.");

          setTimeout(() => {
            props.history.push("/login");
          }, 3 * 1000);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      // 중복확인을 완료한 후 다른 계정명을 다시 작성했을 때, 중복확인을 재요청
      setIsShowErrAlert(true);
      setIsShowSuccessAlert(false);
      setErrMessage("Please duplicate check an account.");
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Widget className="widget-auth mx-auto" title={<h3 className="mt-0">Welcome</h3>}>
          <p className="widget-auth-info">Please fill all fields below.</p>
          <form onSubmit={doRegister}>
            {isShowErrAlert ? (
              <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger">
                {errMessage}
              </Alert>
            ) : null}
            {isShowSuccessAlert ? (
              <Alert className="alert-sm widget-middle-overflow rounded-0" color="success">
                {successMessage}
              </Alert>
            ) : null}

            <FormGroup className="mt">
              <Label for="account">Account</Label>
              <InputGroup className="input-group-no-border">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="la la-user text-white" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="email"
                  className="input-transparent pl-3"
                  value={user.account}
                  onChange={handleInputChange}
                  type="text"
                  required
                  name="account"
                  placeholder="Account"
                />
                <Button color="default" className="social-button" onClick={checkAccount}>
                  Chk
                </Button>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <InputGroup className="input-group-no-border">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="la la-table text-white" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="email"
                  className="input-transparent pl-3"
                  value={user.email}
                  onChange={handleInputChange}
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
                  value={user.password}
                  onChange={handleInputChange}
                  type="password"
                  required
                  name="password"
                  placeholder="Password"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="passwordCheck">Confirm</Label>
              <InputGroup className="input-group-no-border">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="la la-lock text-white" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="passwordCheck"
                  className="input-transparent pl-3"
                  value={user.passwordCheck}
                  onChange={handleInputChange}
                  onBlur={checkPassword}
                  onKeyPress={handleKeyPress}
                  type="password"
                  required
                  name="passwordCheck"
                  placeholder="Confirm"
                />
              </InputGroup>
            </FormGroup>
            <div className="bg-widget-transparent auth-widget-footer">
              <Button type="submit" color="danger" className="auth-btn" size="sm" style={{ color: "#fff" }}>
                Register
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
