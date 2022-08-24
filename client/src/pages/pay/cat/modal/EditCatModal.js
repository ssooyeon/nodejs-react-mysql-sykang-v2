import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import { retrieveCats, updateCat, deleteCat } from "../../../../actions/paycats";

import PayCatService from "../../../../services/PayCatService";

import "./CatModal.css";

export default function EditCatModal({ open, handleCloseClick, cat }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialCatState = {
    name: "",
    ordering: 0,
    type: "",
    createrId: currentUser.id,
  };

  const [catForm, setCatForm] = useState(initialCatState);
  const [catChildren, setCatChildren] = useState([]);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  useEffect(() => {
    setCatForm(cat);
    setCatChildren(cat.children);
  }, [cat]);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setCatForm(initialCatState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };
  // cat 등록 완료
  const handleDone = () => {
    const isDone = true;
    handleCloseClick(false, isDone);
    setCatForm(initialCatState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 catForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCatForm({ ...catForm, [name]: value });
  };

  // 하위 cat add 버튼 클릭
  const handleCatChildAdd = () => {
    let order = 0;
    if (catForm.children.length > 0) {
      order = catForm.children[catForm.children.length - 1].ordering + 1;
    }
    const data = { parentId: catForm.id, name: "nonamed", type: catForm.type, createrId: catForm.createrId };
    PayCatService.create({ ...data, ordering: order })
      .then(() => {
        dispatch(retrieveCats({ userId: currentUser.id }));
        PayCatService.get(cat.id).then((res) => {
          if (res.data.children.length > 0) {
            setCatChildren(res.data.children);
          }
        });
      })
      .catch((e) => console.log(e));
  };

  // 하위 cat table에서 cell 수정 후 event
  const afterSaveCell = (oldVal, newVal, row, col) => {
    if (newVal === "") {
      setIsShowSuccessAlert(false);
      setIsShowErrAlert(true);
      setErrMessage("Name cannot be empty.");
    } else if (oldVal === newVal) {
    } else {
      const data = { id: row.id, name: newVal };
      dispatch(updateCat(data.id, data))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Category updated successfully.");

          setTimeout(() => {
            setIsShowSuccessAlert(false);
          }, 500);
        })
        .catch((e) => console.log(e));
    }
  };

  // 하위 cat table에서 cell 삭제 버튼 클릭
  const deleteCatChild = (id) => {
    dispatch(deleteCat(id))
      .then(() => {
        setIsShowSuccessAlert(true);
        setIsShowErrAlert(false);
        setSuccessMessage("Category deleted successfully.");

        dispatch(retrieveCats({ userId: currentUser.id }));
        PayCatService.get(cat.id).then((res) => {
          if (res.data.children.length > 0) {
            setCatChildren(res.data.children);
          }
        });

        setTimeout(() => {
          setIsShowSuccessAlert(false);
        }, 500);
      })
      .catch((e) => console.log(e));
  };

  // cat 수정
  const editCat = () => {
    if (catForm.name === "") {
      setIsShowSuccessAlert(false);
      setIsShowErrAlert(true);
      setErrMessage("Name cannot be empty.");
    } else {
      dispatch(updateCat(catForm.id, catForm))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Category updated successfully.");

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
        <span className="fw-semi-bold">Update Category</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={editCat}>
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
                value={catForm.name}
                onChange={handleInputChange}
                type="text"
                required
                name="name"
                placeholder="Name"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <div style={{ marginBottom: "5px" }}>
              <Label for="name">Item</Label>
              <div className="float-right" style={{ marginRight: "3px" }}>
                <Button color="default" className="mr-2" size="xs" onClick={handleCatChildAdd}>
                  Add
                </Button>
              </div>
            </div>
            <InputGroup className="input-group-no-border">
              <BootstrapTable
                keyField="id"
                data={catChildren || []}
                columns={[
                  {
                    dataField: "name",
                    text: "name",
                    headerAttrs: { hidden: true },
                    editorStyle: {
                      backgroundColor: "#040620",
                    },
                  },
                  {
                    dataField: "remove",
                    text: "Del",
                    editable: false,
                    headerAttrs: { hidden: true },
                    align: "right",
                    formatter: (cellContent, row) => {
                      return (
                        <Button color="inverse" className="mr-2" size="xs" onClick={() => deleteCatChild(row.id)}>
                          D
                        </Button>
                      );
                    },
                  },
                ]}
                cellEdit={cellEditFactory({
                  mode: "click",
                  autoSelectText: true,
                  afterSaveCell: (oldVal, newVal, row, col) => afterSaveCell(oldVal, newVal, row, col),
                })}
                bordered={false}
                rowStyle={{ height: "10px" }}
              />
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={editCat}>
          Edit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
