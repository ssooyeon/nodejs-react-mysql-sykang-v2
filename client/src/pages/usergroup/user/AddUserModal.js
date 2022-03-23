import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";

import { createUser } from "../../../actions/users";
import UserService from "../../../services/UserService";
import GroupService from "../../../services/GroupService";

export default function AddUserModal({ open, handleCloseClick, handleResetInput }) {
  // 초기 user object
  const initialUserState = {
    account: "",
    email: "",
    password: "",
    passwordCheck: "",
  };

  const [groups, setGroups] = useState([]); // select option에 표시 될 group list (fix)
  const [userForm, setUserForm] = useState(initialUserState);
  const [checkDoneAccount, setCheckDoneAccount] = useState(""); // 중복확인을 완료한 계정 이름

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 사용자 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 사용자 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 사용자 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 사용자 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  useEffect(() => {
    GroupService.getAll()
      .then((res) => {
        setGroups(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // 닫기 버튼 클릭
  const handleClose = () => {
    handleCloseClick(false);
    setUserForm(initialUserState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // 사용자 추가 완료
  const handleDone = () => {
    const isDone = true;
    handleCloseClick(false, isDone);
    setUserForm(initialUserState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 user state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };
  // group 옵션 변경
  const handleGroupOption = (e) => {
    setUserForm({ ...userForm, groupId: e.target.value });
  };

  // password check input에서 엔터 클릭 시 사용자 생성 수행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doAddUser(e);
    }
  };

  // 계정 중복확인
  const checkAccount = () => {
    const account = userForm.account;
    if (account !== "") {
      UserService.findByAccount(userForm.account)
        .then((res) => {
          // 이미 존재하는 계정일 때
          if (res.data !== "" && res.data !== undefined) {
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

  // 비밀번호 및 비밀번호 확인란이 동일한지 검사한 후 메세지 표출
  const checkPassword = () => {
    if (!isPasswordValid()) {
      setIsShowErrAlert(true);
      setIsShowSuccessAlert(false);
      if (!userForm.password) {
        setErrMessage("Password field is empty.");
      } else {
        setErrMessage("Passwords are not equal.");
      }
    }
  };

  // 비밀번호 및 비밀번호 확인란이 동일한지의 여부
  const isPasswordValid = () => {
    return userForm.password && userForm.password === userForm.passwordCheck;
  };

  // 사용자 등록 수행
  const doAddUser = (e) => {
    e.preventDefault();
    // 중복확인을 완료한 계정과 현재 input의 계정명이 같을 때
    if (checkDoneAccount === userForm.account) {
      // 비밀번호와 비밀번호 확인란이 일치할 때
      if (isPasswordValid()) {
        dispatch(createUser(userForm))
          .then(() => {
            setIsShowSuccessAlert(true);
            setIsShowErrAlert(false);
            setSuccessMessage("New user added successfully.");

            setTimeout(() => {
              handleDone();
            }, 500);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      // 중복확인을 완료한 후 다른 계정명을 다시 작성했을 때, 중복확인을 재요청
      setIsShowErrAlert(true);
      setIsShowSuccessAlert(false);
      setErrMessage("Please duplicate check an account.");
    }
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Add New User</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={doAddUser}>
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
                id="account"
                className="input-transparent pl-3"
                value={userForm.account}
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
                value={userForm.email}
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
                value={userForm.password}
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
                value={userForm.passwordCheck}
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
          <FormGroup>
            <Label for="group">Group</Label>
            <InputGroup className="input-group-no-border">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="la la-group text-white" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="group"
                className="input-transparent pl-3"
                type="select"
                name="group"
                value={userForm.groupId || ""}
                onChange={handleGroupOption}
              >
                <option value={""}>-</option>
                {groups &&
                  groups.map((group, index) => {
                    return (
                      <option value={group.id} key={group.id}>
                        {group.name}
                      </option>
                    );
                  })}
              </Input>
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={doAddUser}>
          Add
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
