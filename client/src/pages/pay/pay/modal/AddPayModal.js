import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import DateTimePicker from "react-datetime-picker";

import s from "./Modal.module.scss";

import { createPay } from "../../../../actions/pays";

export default function AddPayModal({ open, handleCloseClick, asserts, cats }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialPayState = {
    amount: 0,
    description: "",
    date: new Date(),
    createrId: currentUser.id,
    assertId: "",
    catId: "",
  };

  const [payForm, setPayForm] = useState(initialPayState);
  const [amount, setAmount] = useState(0);
  const [payType, setPayType] = useState("spending");

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setPayForm(initialPayState);
    setAmount(0);
    setPayType("spending");
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };
  // payment 등록 완료
  const handleDone = () => {
    const isDone = true;
    handleCloseClick(false, isDone);
    setPayForm(initialPayState);
    setAmount(0);
    setPayType("spending");
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // amount state 업데이트 (comma 포함)
  const handleAmountChange = (e) => {
    const str = e.target.value;
    const comma = (str) => {
      str = String(str);
      return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
    };
    const uncomma = (str) => {
      str = String(str);
      return str.replace(/[^\d]+/g, "");
    };
    setAmount(comma(uncomma(str)));
  };
  // input 값 변경 시 payForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayForm({ ...payForm, [name]: value });
  };
  // 날짜 변경
  const onDateChange = (date) => {
    setPayForm({ ...payForm, date: date });
  };
  // assert 옵션 변경
  const handleAssertOption = (e) => {
    setPayForm({ ...payForm, assertId: e.target.value });
  };
  // cat 옵션 변경
  const handleCatOption = (e) => {
    setPayForm({ ...payForm, catId: e.target.value });
  };

  // payment 등록
  const addPay = () => {
    const num = parseInt(amount);
    if (Math.abs(num) === 0) {
      setIsShowSuccessAlert(false);
      setIsShowErrAlert(true);
      setErrMessage("Amount cannot be zero.");
    } else {
      const withoutComma = amount.split(",").reduce((curr, acc) => curr + acc, "");
      const data = {
        ...payForm,
        amount: payType === "income" ? withoutComma : -withoutComma,
        assertId: payForm.assertId === "" ? null : payForm.assertId,
        catId: payForm.catId === "" ? null : payForm.catId,
      };
      dispatch(createPay(data))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("New payment added successfully.");

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
        <span className="fw-semi-bold">Add New Payment</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={addPay}>
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
                style={{ width: "48%", background: payType === "income" ? "#9d702c" : "" }}
                onClick={() => {
                  setPayType("income");
                  setPayForm({ ...payForm, catId: "" });
                  console.log(cats);
                }}
              >
                Income
              </Button>
              <Button
                color="inverse"
                className="mr-2"
                size="sm"
                style={{ width: "49%", background: payType === "income" ? "" : "#9d702c" }}
                onClick={() => {
                  setPayType("spending");
                  setPayForm({ ...payForm, catId: "" });
                }}
              >
                Spending
              </Button>
            </InputGroup>
          </FormGroup>
          <FormGroup className="mt">
            <Label for="amount">Amount</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="amount"
                className="input-transparent pl-3"
                value={amount}
                onChange={handleAmountChange}
                type="text"
                required
                name="amount"
                placeholder="amount"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="description"
                className="input-transparent pl-3"
                value={payForm.description}
                onChange={handleInputChange}
                rows={2}
                type="textarea"
                required
                name="description"
                placeholder="Description"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <div className={s.dateWrapper}>
              <span className={s.labelText}>Date</span>
              <DateTimePicker
                locale="en"
                format="yyyy-MM-dd HH:mm"
                minutePlaceholder="mm"
                hourPlaceholder="hh"
                dayPlaceholder="dd"
                monthPlaceholder="MM"
                yearPlaceholder="yyyy"
                className={s.datePicker}
                clearIcon={null}
                onChange={onDateChange}
                value={payForm.date ? new Date(payForm.date) : null}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="description">Assert</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="assertOption"
                className="input-transparent pl-3"
                type="select"
                name="assertOption"
                value={payForm.assertId}
                onChange={handleAssertOption}
              >
                <option value="">NONE</option>
                {asserts &&
                  asserts.map((assert, index) => {
                    return (
                      <option value={assert.id} key={assert.id}>
                        {assert.name}
                      </option>
                    );
                  })}
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="description">Cat</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="catOption"
                className="input-transparent pl-3"
                type="select"
                name="catOption"
                value={payForm.catId}
                onChange={handleCatOption}
              >
                <option value="">NONE</option>
                {cats &&
                  cats
                    .filter((x) => x.type === payType)
                    .map((cat, index) => {
                      return (
                        <optgroup label={cat.name} key={cat.id}>
                          {cat.children &&
                            cat.children.map((c, index) => {
                              return (
                                <option value={c.id} key={c.id}>
                                  {c.name}
                                </option>
                              );
                            })}
                        </optgroup>
                      );
                    })}
              </Input>
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={addPay}>
          Add
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
