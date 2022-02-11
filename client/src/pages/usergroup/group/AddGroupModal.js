import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";

import { createGroup } from "../../../actions/groups";
import GroupService from "../../../services/GroupService";

export default function AddGroupModal({ open, handleCloseClick, handleResetInput }) {
  // 초기 group object
  const initialGroupState = {
    name: "",
    description: "",
  };

  const [groupForm, setGroupForm] = useState(initialGroupState);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 사용자 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 사용자 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 사용자 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 사용자 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  // 닫기 버튼 클릭
  const handleClose = () => {
    handleCloseClick(false);
    setGroupForm(initialGroupState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };
  // 그룹 추가를 수행하면 검색란을 초기화
  const sendSearchReset = () => {
    handleResetInput(true);
  };

  // input 값 변경 시 group state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupForm({ ...groupForm, [name]: value });
  };

  // description input에서 엔터 클릭 시 사용자 생성 수행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doAddGroup(e);
    }
  };

  // 그룹 등록 수행
  const doAddGroup = (e) => {
    e.preventDefault();
    const name = groupForm.name;
    if (name !== "") {
      GroupService.findByName(name).then((res) => {
        // 이미 존재하는 그룹 이름일 때
        if (res.data !== "" && res.data !== undefined) {
          setIsShowErrAlert(true);
          setIsShowSuccessAlert(false);
          setErrMessage("This name already exist.");
        } else {
          sendSearchReset();
          dispatch(createGroup(groupForm))
            .then(() => {
              setIsShowSuccessAlert(true);
              setIsShowErrAlert(false);
              setSuccessMessage("Group create successfully.");

              setTimeout(() => {
                handleClose();
              }, 500);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Add New Group</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={doAddGroup}>
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
            <Label for="name">Name</Label>
            <InputGroup className="input-group-no-border">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="la la-user text-white" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="name"
                className="input-transparent pl-3"
                value={groupForm.name}
                onChange={handleInputChange}
                type="text"
                required
                name="name"
                placeholder="Name"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <InputGroup className="input-group-no-border">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="la la-table text-white" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="description"
                className="input-transparent pl-3"
                value={groupForm.description}
                onKeyPress={handleKeyPress}
                onChange={handleInputChange}
                type="description"
                required
                name="description"
                placeholder="Description"
              />
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={doAddGroup}>
          Add
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
