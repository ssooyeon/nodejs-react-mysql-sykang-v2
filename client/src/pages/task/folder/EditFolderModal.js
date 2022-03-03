import React, { useEffect, useState } from "react";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";

import FolderService from "../../../services/FolderService";

export default function EditFolderModal({ open, handleCloseClick, folder }) {
  const [folderForm, setFolderForm] = useState([]);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 게시글 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 게시글 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 게시글 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 게시글 등록에 실패했을 때의 에러 메시지

  useEffect(() => {
    setFolderForm({ ...folder });
  }, [folder]);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 taskForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFolderForm({ ...folderForm, [name]: value });
  };

  // 폴더(컬럼) 수정 버튼 클릭
  const editFolder = (e) => {
    e.preventDefault();
    if (folderForm.name === "") {
      setIsShowErrAlert(true);
      setErrMessage("Field is empty.");
    } else {
      const data = {
        id: folderForm.id,
        name: folderForm.name,
      };
      edit(data);
    }
  };

  // 폴더(컬럼) 수정
  const edit = (column) => {
    FolderService.update(column.id, column)
      .then(() => {
        setIsShowSuccessAlert(true);
        setIsShowErrAlert(false);
        setSuccessMessage("Folder(Column) name updated successfully.");

        setTimeout(() => {
          handleClose();
        }, 500);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Edit Folder(Column) Name</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={editFolder}>
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
            <Label for="title">Title</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="name"
                className="input-transparent pl-3"
                value={folderForm.name}
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
        <Button color="danger" className="mr-2" size="sm" onClick={editFolder}>
          Edit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
