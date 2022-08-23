import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";

import { updateAssert } from "../../../actions/payasserts";

export default function EditAssertModal({ open, handleCloseClick, assert }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialAssertState = {
    name: "",
    ordering: 0,
    createrId: currentUser.id,
  };

  const [assertForm, setAssertForm] = useState(initialAssertState);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 수정에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 수정에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 수정에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 수정에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  useEffect(() => {
    setAssertForm(assert);
  }, [assert]);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setAssertForm(initialAssertState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };
  // assert 수정 완료
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

  // assert 수정
  const editAssert = () => {
    if (assertForm.name === "") {
      setIsShowSuccessAlert(false);
      setIsShowErrAlert(true);
      setErrMessage("Name cannot be empty.");
    } else {
      dispatch(updateAssert(assertForm.id, assertForm))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Assert updated successfully.");

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
        <span className="fw-semi-bold">Edit Assert</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={editAssert}>
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
        <Button color="danger" className="mr-2" size="sm" onClick={editAssert}>
          Edit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
