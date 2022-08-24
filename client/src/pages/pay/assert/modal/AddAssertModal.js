import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";

import { createAssert } from "../../../../actions/payasserts";

export default function AddAssertModal({ open, handleCloseClick, assertLastOrderNum }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialAssertState = {
    name: "",
    ordering: assertLastOrderNum,
    createrId: currentUser.id,
  };

  const [assertForm, setAssertForm] = useState(initialAssertState);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setAssertForm(initialAssertState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };
  // assert 등록 완료
  const handleDone = () => {
    const isDone = true;
    handleCloseClick(false, isDone);
    setAssertForm(initialAssertState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 assertForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssertForm({ ...assertForm, [name]: value });
  };

  // assert 등록
  const addAssert = () => {
    if (assertForm.name === "") {
      setIsShowSuccessAlert(false);
      setIsShowErrAlert(true);
      setErrMessage("Name cannot be empty.");
    } else {
      dispatch(createAssert({ ...assertForm, ordering: assertLastOrderNum + 1 }))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("New assert added successfully.");

          setTimeout(() => {
            handleDone();
          }, 500);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Add New Assert</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={addAssert}>
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
          <br />
          <FormGroup>
            <Label for="name">Name</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="name"
                className="input-transparent pl-3"
                value={assertForm.name}
                onChange={handleInputChange}
                type="text"
                required
                name="name"
                placeholder="Name"
              />
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={addAssert}>
          Add
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
