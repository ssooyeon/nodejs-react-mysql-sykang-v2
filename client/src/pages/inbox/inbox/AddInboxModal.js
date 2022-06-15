import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter, Table } from "reactstrap";
import PaginationComponent from "react-reactstrap-pagination";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";
import s from "./InboxForm.module.scss";

import { createInbox } from "../../../actions/inboxs";
import UserService from "../../../services/UserService";

const pageSize = 5;

export default function AddInboxModal({ open, handleCloseClick }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialInboxstate = {
    title: "",
    content: "",
    isConfirmed: false,
    isSend: false,
    folderName: "",
    senderId: currentUser.id,
    receiverId: "",
    ownerId: "",
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // content editor
  const [inboxForm, setInboxForm] = useState(initialInboxstate);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // Inbox 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // Inbox 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // Inbox 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // Inbox 등록에 실패했을 때의 에러 메시지

  const [users, setUsers] = useState([]);
  const [usersCurrentPage, setUsersCurrentPage] = useState(0);
  const [selectionUsers, setSelectionUsers] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getAll()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setInboxForm(initialInboxstate);
    setEditorState(EditorState.createEmpty());
    setSelectionUsers([]);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 InboxForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInboxForm({ ...inboxForm, [name]: value });
  };
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  // 이미지 source to base64
  const getFileBase64 = (file, callback) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => {};
  };
  // 이미지 업로드
  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => getFileBase64(file, (data) => resolve({ data: { link: data } })));
  };

  // 사용자 테이블 row checkbox 클릭
  const handleUserRowClick = (e) => {
    const clickedUserId = parseInt(e.target.value);
    // 체크박스를 해제했을 경우 selectionUsers에서 삭제
    if (selectionUsers.includes(clickedUserId)) {
      setSelectionUsers(selectionUsers.filter((x) => x !== clickedUserId));
    } else {
      // 체크박스를 체크했을 경우 selectionUsers에 추가
      setSelectionUsers([...selectionUsers, clickedUserId]);
    }
  };
  // 사용자 테이블 페이징
  const handleUserTablePaging = (selectedPage) => {
    setUsersCurrentPage(selectedPage - 1);
  };

  // Inbox 등록 버튼 클릭
  const addInbox = (e) => {
    e.preventDefault();
    if (inboxForm.title === "" || selectionUsers.length === 0) {
      setIsShowErrAlert(true);
      setErrMessage("Title field is empty. or select a receiver.");
    } else {
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      const markup = draftToHtml(rawContentState);

      selectionUsers.forEach((userId) => {
        const sentData = { ...inboxForm, content: markup, folderName: "sent", receiverId: userId, ownerId: currentUser.id };
        const recvData = { ...inboxForm, content: markup, folderName: "inbox", receiverId: userId, ownerId: userId };
        dispatch(createInbox(sentData)).then(() => {
          dispatch(createInbox(recvData));
        });
      });

      setIsShowSuccessAlert(true);
      setIsShowErrAlert(false);
      setSuccessMessage("New Inbox added successfully.");

      setTimeout(() => {
        handleClose();
      }, 500);
    }
  };

  return (
    <Modal size="lg" isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Send New Inbox</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={addInbox}>
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
                id="title"
                className="input-transparent pl-3"
                value={inboxForm.title}
                onChange={handleInputChange}
                type="text"
                required
                name="title"
                placeholder="Title"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="content">Content</Label>
            <InputGroup className="input-group-no-border">
              <Editor
                editorStyle={{
                  border: "1px solid #C0C0C0",
                  height: "350px",
                  padding: "5px",
                  fontSize: "14px",
                  width: "770px",
                }}
                id="content"
                name="content"
                value={inboxForm.content}
                wrapperClassName="wrapper-class"
                editorClassName="editor"
                toolbarClassName="toolbar-class"
                toolbar={{
                  options: ["inline", "fontSize", "list", "textAlign", "colorPicker", "image", "history"],
                  inline: { options: ["bold", "italic", "underline"] },
                  // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼 것인지
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  image: { uploadCallback: uploadImageCallBack, previewImage: true },
                  history: { inDropdown: false },
                }}
                placeholder="Content"
                // 한국어 설정
                localization={{
                  locale: "ko",
                }}
                // 초기값 설정
                editorState={editorState}
                // 에디터의 값이 변경될 때마다 onEditorStateChange 호출
                onEditorStateChange={onEditorStateChange}
              />
            </InputGroup>
          </FormGroup>
        </form>
        <FormGroup className="mt">
          <Label for="title">Receiver</Label>
          <InputGroup className="input-group-no-border">
            <div className={s.userTableWrapper}>
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th> </th>
                    <th>Account</th>
                    <th>Email</th>
                    <th>Group</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody style={{ minWidth: "" }}>
                  {users &&
                    users.slice(usersCurrentPage * pageSize, (usersCurrentPage + 1) * pageSize).map((user) => {
                      return (
                        <tr
                          key={user.id}
                          style={{
                            background: selectionUsers && selectionUsers.includes(user.id) ? "rgb(57 68 98)" : "",
                          }}
                        >
                          <td>
                            <input
                              type="checkbox"
                              value={user.id}
                              checked={selectionUsers && selectionUsers.includes(user.id) ? true : false}
                              onChange={(e) => handleUserRowClick(e)}
                            />
                          </td>
                          <td>{user.account}</td>
                          <td>
                            <a href="#">{user.email}</a>
                          </td>
                          <td>{user.group ? user.group.name : "-"}</td>
                        </tr>
                      );
                    })}
                </tbody>
                {/* eslint-enable */}
              </Table>
              <div className={s.userPaging}>
                <PaginationComponent
                  size="sm"
                  totalItems={users.length}
                  pageSize={pageSize}
                  defaultActivePage={1}
                  firstPageText="<<"
                  previousPageText="<"
                  nextPageText=">"
                  lastPageText=">>"
                  onSelect={handleUserTablePaging}
                />
              </div>
            </div>
          </InputGroup>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={addInbox}>
          Send
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
