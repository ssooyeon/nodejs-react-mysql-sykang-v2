import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { Row, Col, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from "reactstrap";

import Widget from "../../components/Widget";
import s from "./Profile.module.scss";

import { updateLoggedUser } from "../../actions/auth";
import { compareCurrentPassword, updateUser } from "../../actions/users";

export default function Profile(props) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialUserState = {
    id: null,
    account: "",
    email: "",
    currentPassword: "",
    password: "",
    passwordCheck: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [isPasswordChange, setIsPasswordChange] = useState(false); // 비밀번호를 변경할지에 대한 여부

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 사용자 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 사용자 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 사용자 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 사용자 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser !== null) {
      setUser({
        id: currentUser.id,
        account: currentUser.account,
        email: currentUser.email,
        currentPassword: "",
        password: "",
        passwordCheck: "",
      });
    }
  }, []);

  // 비밀번호 변경 화면 표출
  const handleIsPasswordChange = (e) => {
    e.preventDefault();
    setIsPasswordChange(!isPasswordChange);
  };

  // input 값 변경 시 user state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // password check input에서 엔터 클릭 시 사용자 생성 수행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doEditUser(e);
    }
  };

  // 비밀번호 및 비밀번호 확인란이 동일한지의 여부
  const isPasswordValid = () => {
    return user.password && user.password === user.passwordCheck;
  };

  // 사용자 수정 수행
  const doEditUser = (e) => {
    e.preventDefault();
    let data = user;
    if (data.groupId === "") {
      data.groupId = null;
    }
    // 비밀번호 변경란이 열려있으면
    if (isPasswordChange) {
      // 비밀번호를 입력하지 않았으면
      if (user.currentPassword === "" && user.password === "" && user.passwordCheck === "") {
        setIsShowErrAlert(true);
        setIsShowSuccessAlert(false);
        setErrMessage("All password field is empty.");
      } else {
        const comparePassword = {
          id: user.id,
          password: user.currentPassword,
        };
        // 현재 비밀번호를 제대로 입력했는지 확인
        dispatch(compareCurrentPassword(comparePassword)).then((compare) => {
          // 현재 비밀번호를 제대로 입력했다면
          if (compare) {
            // 새 비밀번호와 비밀번호 확인란이 일치하는지 확인
            if (isPasswordValid()) {
              doEdit(data);
            } else {
              // 새 비밀번호와 비밀번호 확인란이 일치하지 않으면 에러 메세지를 표출
              setIsShowErrAlert(true);
              setIsShowSuccessAlert(false);
              if (!user.password) {
                setErrMessage("Password field is empty.");
              } else {
                setErrMessage("Passwords are not equal.");
              }
            }
          } else {
            // 현재 비밀번호가 틀리다면 에러 메세지를 표출
            setIsShowErrAlert(true);
            setIsShowSuccessAlert(false);
            setErrMessage("The current password dose not match.");
          }
        });
      }
    } else {
      // 비밀번호 변경란이 열려있지 않으면 email과 group 정보만 업데이트
      const paramsWithoutPassword = {
        id: data.id,
        account: data.account,
        email: data.email,
        groupId: data.groupId,
      };
      doEdit(paramsWithoutPassword);
    }
  };

  const doEdit = (user) => {
    dispatch(updateUser(user.id, user))
      .then(() => {
        // store currentUser 정보 업데이트
        dispatch(updateLoggedUser(currentUser.id))
          .then((res) => {
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
          })
          .catch((e) => console.log(e));

        setIsShowSuccessAlert(true);
        setIsShowErrAlert(false);
        setSuccessMessage("User update successfully.");

        setTimeout(() => {
          props.history.push("/");
        }, 500);
      })
      .catch((e) => console.log(e));
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
              <form onSubmit={doEditUser}>
                {isShowErrAlert ? (
                  <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger" style={{ margin: 0 }}>
                    {errMessage}
                  </Alert>
                ) : null}
                {isShowSuccessAlert ? (
                  <Alert className="alert-sm widget-middle-overflow rounded-0" color="success" style={{ margin: 0 }}>
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
                      name="account"
                      placeholder="Account"
                      disabled
                    />
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
                <div style={{ marginBottom: "10px" }}>
                  <a href="#!" onClick={handleIsPasswordChange}>
                    password change&nbsp;
                    {isPasswordChange ? <i className="la la-arrow-circle-o-up" /> : <i className="la la-arrow-circle-o-down" />}
                  </a>
                </div>
                {isPasswordChange ? (
                  <>
                    <FormGroup>
                      <Label for="currentPassword">Current Password</Label>
                      <InputGroup className="input-group-no-border">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="la la-lock text-white" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="currentPassword"
                          className="input-transparent pl-3"
                          value={user.currentPassword}
                          onChange={handleInputChange}
                          type="password"
                          required
                          name="currentPassword"
                          placeholder="Current Password"
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
                          placeholder="New Password"
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
                          onKeyPress={handleKeyPress}
                          type="password"
                          required
                          name="passwordCheck"
                          placeholder="New Password Confirm"
                        />
                      </InputGroup>
                    </FormGroup>
                  </>
                ) : null}
              </form>
            </div>
            <br />
            <Button color="danger" className="mr-2" size="sm" onClick={doEditUser}>
              Edit
            </Button>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
