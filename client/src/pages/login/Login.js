import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Container, Alert, Button, FormGroup, Label, InputGroup, InputGroupAddon, Input, InputGroupText } from "reactstrap";

import { LoginSocialGoogle } from "reactjs-social-login";

import Widget from "../../components/Widget";

import { authLogin, authSocialLogin } from "../../actions/auth";

export default function Login(props) {
  // 초기 user object
  const initialUserState = {
    id: null,
    account: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [isLoginFailed, setIsLoginFailed] = useState(false); // 로그인에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 로그인에 실패했을 때의 에러 메세지
  const dispatch = useDispatch();

  // input 값 변경 시 user state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // 비밀번호란에서 엔터를 쳤을 때도 로그인을 수행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doLogin(e);
    }
  };

  // 로그인 수행
  const doLogin = (e) => {
    e.preventDefault();
    dispatch(authLogin(user))
      .then((res) => {
        // 에러메세지가 존재하면
        if (res.message !== undefined) {
          setIsLoginFailed(true);
          setErrMessage(res.message);
        } else {
          // 로그인에 성공했을 경우 local storage에 저장
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.user.token}`;
          localStorage.setItem("user", JSON.stringify(res.user));
          props.history.push("/");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 소셜 로그인 수행 (구글)
  const doSocialLogin = (provider) => {
    const account = provider.data.email.split("@")[0];
    let loging = {
      type: provider.provider,
      account: account,
      email: provider.data.email,
    };

    dispatch(authSocialLogin(loging)).then((res) => {
      // 에러메세지가 존재하면
      if (res.message !== undefined) {
        setIsLoginFailed(true);
        setErrMessage(res.message);
      } else {
        // 로그인에 성공했을 경우 local storage에 저장
        axios.defaults.headers.common["Authorization"] = `Bearer ${provider.data.id_token}`;
        const item = { ...res.user, token: provider.data.id_token };
        localStorage.setItem("user", JSON.stringify(item));
        props.history.push("/");
      }
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
                Login&nbsp;
                <span className="auth-btn-circle" style={{ marginRight: 8 }}>
                  <i className="la la-caret-right" />
                </span>
              </Button>
              <p className="widget-auth-info mt-4">Don't have an account? Sign up now!</p>
              <Link className="d-block text-center mb-4" to="register">
                Create an Account
              </Link>

              <div className="social-buttons">
                <LoginSocialGoogle
                  client_id={process.env.REACT_APP_GG_APP_ID}
                  onLoginStart={() => {}}
                  onLoginFailure={() => {}}
                  onLogoutSuccess={() => {}}
                  onResolve={(provider, data) => {
                    doSocialLogin(provider);
                  }}
                  onReject={(err) => {
                    console.log(err);
                  }}
                >
                  <Button color="primary" className="social-button" style={{ width: "100%" }}>
                    <i className="social-icon social-google" />
                    <p className="social-text">GOOGLE</p>
                  </Button>
                </LoginSocialGoogle>
              </div>
            </div>
          </form>
        </Widget>
      </Container>
      <footer className="auth-footer">
        React project made by <a href="/">sykang</a>, refer: <a href="https://flatlogic.com">Flatlogic</a>
      </footer>
    </div>
  );
}
