import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";

import { createCat } from "../../../../actions/paycats";

export default function AddCatModal({ open, handleCloseClick, catLastOrderNum }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialCatState = {
    name: "",
    ordering: catLastOrderNum,
    createrId: currentUser.id,
  };

  const [catForm, setCatForm] = useState(initialCatState);
  const [catType, setCatType] = useState("spending");

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setCatForm(initialCatState);
    setCatType("spending");
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };
  // cat 등록 완료
  const handleDone = () => {
    const isDone = true;
    handleCloseClick(false, isDone);
    setCatForm(initialCatState);
    setCatType("spending");
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 catForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCatForm({ ...catForm, [name]: value });
  };

  // cat 등록
  const addCat = () => {
    if (catForm.name === "") {
      setIsShowSuccessAlert(false);
      setIsShowErrAlert(true);
      setErrMessage("Name cannot be empty.");
    } else {
      dispatch(createCat({ ...catForm, type: catType, ordering: catLastOrderNum + 1 }))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("New category added successfully.");

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
        <span className="fw-semi-bold">Add New Category</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={addCat}>
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
            <InputGroup className="input-group-no-border">
              <Button
                color="inverse"
                className="mr-2"
                size="sm"
                style={{ width: "48%", background: catType === "income" ? "#9d702c" : "" }}
                onClick={() => {
                  setCatType("income");
                  setCatForm({ ...catForm, type: "" });
                }}
              >
                Income
              </Button>
              <Button
                color="inverse"
                className="mr-2"
                size="sm"
                style={{ width: "49%", background: catType === "income" ? "" : "#9d702c" }}
                onClick={() => {
                  setCatType("spending");
                  setCatForm({ ...catForm, type: "" });
                }}
              >
                Spending
              </Button>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="name"
                className="input-transparent pl-3"
                value={catForm.name}
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
        <Button color="danger" className="mr-2" size="sm" onClick={addCat}>
          Add
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
