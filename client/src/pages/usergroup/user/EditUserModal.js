import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";

import { updateUser } from "../../../actions/users";
import GroupService from "../../../services/GroupService";
import AlarmService from "../../../services/AlarmService";

export default function EditUserModal({ open, handleCloseClick, user }) {
  const [groups, setGroups] = useState([]); // select option에 표시 될 group list (fix)
  const [userForm, setUserForm] = useState([]);
  const [isPasswordChange, setIsPasswordChange] = useState(false); // 비밀번호를 변경할지에 대한 여부

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 사용자 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 사용자 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 사용자 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 사용자 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  useEffect(() => {
    setUserForm({ ...user, password: "", passwordCheck: "" });
    GroupService.getAll()
      .then((res) => {
        setGroups(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user]);

  // 닫기 버튼 클릭
  const handleClose = () => {
    handleCloseClick(false);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // 사용자 수정 완료
  const handleDone = () => {
    const isDone = true;
    handleCloseClick(false, isDone);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // 비밀번호 변경 화면 표출
  const handleIsPasswordChange = (e) => {
    e.preventDefault();
    setIsPasswordChange(!isPasswordChange);
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
      doEditUser(e);
    }
  };

  // 비밀번호 및 비밀번호 확인란이 동일한지의 여부
  const isPasswordValid = () => {
    return userForm.password && userForm.password === userForm.passwordCheck;
  };

  // 사용자 수정 수행
  const doEditUser = (e) => {
    e.preventDefault();
    let data = userForm;
    if (data.groupId === "") {
      data.groupId = null;
    }
    // 비밀번호 변경란이 열려있으면
    if (isPasswordChange) {
      // 비밀번호와 비밀번호 확인란이 일치하면 사용자 수정 진행
      if (isPasswordValid()) {
        doEdit(data);
      } else {
        // 비밀번호와 비밀번호 확인란이 일치하지 않으면 에러 메세지를 표출
        setIsShowErrAlert(true);
        setIsShowSuccessAlert(false);
        if (!userForm.password) {
          setErrMessage("Password field is empty.");
        } else {
          setErrMessage("Passwords are not equal.");
        }
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
        setIsShowSuccessAlert(true);
        setIsShowErrAlert(false);
        setSuccessMessage("User update successfully.");

        // todo: create alarm: update user in my group (2)
        // 사용자 수정 시 그룹이 있다면 그룹 멤버들에게 알람
        const id = { userId: user.id, groupId: null };
        const alarm = {
          message: `Your group member(account: ${user.account}) profile has been modified.`,
          status: "INFO",
        };
        AlarmService.createWithGroupMembers({ id: id, alarm: alarm });

        setTimeout(() => {
          handleDone();
        }, 500);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Edit User</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
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
                value={userForm.account}
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
                value={userForm.email}
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
                    value={userForm.passwordCheck}
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
        <Button color="danger" className="mr-2" size="sm" onClick={doEditUser}>
          Edit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
