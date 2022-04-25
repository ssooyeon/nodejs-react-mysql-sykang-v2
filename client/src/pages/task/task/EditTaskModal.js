import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import { CirclePicker } from "react-color";
import DateTimePicker from "react-datetime-picker";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Swal from "sweetalert2";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";
import s from "./TaskForm.module.scss";

import { retrieveTaskByUser } from "../../../actions/tasks";
import { retrieveAlarmByUser } from "../../../actions/alarms";
import { updateTask } from "../../../actions/tasks";
import AlarmService from "../../../services/AlarmService";

export default function EditTaskModal({ open, handleCloseClick, task }) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // description editor
  const [taskForm, setTaskForm] = useState([]);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 게시글 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 게시글 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 게시글 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 게시글 등록에 실패했을 때의 에러 메시지

  const [isEdit, setIsEdit] = useState(false); // 상세보기인지 수정인지의 여부

  const dispatch = useDispatch();

  useEffect(() => {
    setTaskForm({ ...task });
    if (task.description !== undefined) {
      // 에디터에 html 바인딩
      const blocksFromHtml = htmlToDraft(task.description);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const data = EditorState.createWithContent(contentState);
      setEditorState(data);
    }
  }, [task]);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setTaskForm({ ...taskForm, labelColor: null });
    setIsEdit(false);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 taskForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });
  };
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const onColorStateChange = (colorState) => {
    setTaskForm({ ...taskForm, labelColor: colorState });
  };
  const onDateChange = (date) => {
    setTaskForm({ ...taskForm, dueDate: date });
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

  // 테스크 내용 수정 취소 버튼 클릭
  const cancelEditDescription = () => {
    Swal.fire({
      text: "Return to the description before the edit. Would you like to cancel?",
      icon: "warning",
      backdrop: false,
      showCancelButton: true,
      confirmButtonColor: "#da2837",
      cancelButtonColor: "#30324d",
      confirmButtonText: "OK",
      showClass: {
        backdrop: "swal2-noanimation",
        icon: "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEdit(false);
        setTaskForm({ ...taskForm, description: task.description });
        // 에디터에 수정 전 html 바인딩
        const blocksFromHtml = htmlToDraft(task.description);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const data = EditorState.createWithContent(contentState);
        setEditorState(data);
      }
    });
  };

  // 테스크 수정 버튼 클릭
  const editTask = (e) => {
    e.preventDefault();
    if (taskForm.title === "") {
      setIsShowErrAlert(true);
      setErrMessage("Title field is empty.");
    } else {
      const id = task.id.replace("task", "");
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      const markup = draftToHtml(rawContentState);
      const data = { ...taskForm, description: markup, id: id };
      dispatch(updateTask(data.id, data))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Task updated successfully.");

          // 테스크 수정 시 그룹 멤버들에게 알람
          const id = { userId: taskForm.createrId, groupId: null };
          const alarm = {
            message: `Your group's task(title: ${taskForm.title}) has been modified.`,
            status: "INFO",
          };
          AlarmService.createWithGroupMembers({ id: id, alarm: alarm });

          setTimeout(() => {
            handleClose();
            // 로그인한 유저의 테스크 및 알람 리스트 재조회 (header)
            dispatch(retrieveTaskByUser(currentUser.id));
            dispatch(retrieveAlarmByUser(currentUser.id));
          }, 500);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <Modal size="lg" isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Edit Task</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={editTask}>
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
                value={taskForm.title}
                onChange={handleInputChange}
                type="text"
                required
                name="title"
                placeholder="Title"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="description" style={{ width: "100%" }}>
              Description
              {isEdit ? (
                <Button color="danger" className={s.transparentButton} size="xs" style={{ float: "right" }} onClick={cancelEditDescription}>
                  <i className="fa fa-remove"></i> Cancel
                </Button>
              ) : (
                <Button
                  color="inverse"
                  className={s.transparentButton}
                  size="xs"
                  style={{ float: "right" }}
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <i className="fa fa-edit"></i> Edit
                </Button>
              )}
            </Label>
            {isEdit ? (
              <InputGroup className="input-group-no-border">
                <Editor
                  editorStyle={{
                    border: "1px solid #C0C0C0",
                    height: "350px",
                    padding: "5px",
                    fontSize: "14px",
                    width: "770px",
                  }}
                  id="description"
                  name="description"
                  value={taskForm.description}
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
                  placeholder="Description"
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
            ) : (
              <div
                style={{ height: "400px", overflowY: "auto", wordBreak: "break-word", border: "1px solid", padding: "10px" }}
                dangerouslySetInnerHTML={{ __html: taskForm.description }}
              ></div>
            )}
          </FormGroup>
          <FormGroup>
            <div className={s.dateWrapper}>
              <span className={s.labelText}>Due date</span>
              <DateTimePicker
                locale="en"
                format="yyyy-MM-dd HH:mm"
                minutePlaceholder="mm"
                hourPlaceholder="hh"
                dayPlaceholder="dd"
                monthPlaceholder="MM"
                yearPlaceholder="yyyy"
                className={s.dueDatePicker}
                onChange={onDateChange}
                value={taskForm.dueDate ? new Date(taskForm.dueDate) : null}
              />
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="labelColor">
              Label Color: &nbsp;
              {taskForm.labelColor ? (
                <>
                  <div className={s.labelDiv} style={{ background: taskForm.labelColor }}></div>
                  <Button
                    color=""
                    className={s.transparentButton}
                    style={{ color: "rgba(244, 244, 245, 0.6)" }}
                    size="xs"
                    onClick={() => onColorStateChange(null)}
                  >
                    <i className="fa fa-remove"></i>
                  </Button>
                </>
              ) : (
                <div className={s.labelDiv} style={{ background: "" }}></div>
              )}
            </Label>
            <InputGroup className="input-group-no-border">
              <CirclePicker
                colors={["red", "orange", "yellow", "green", "blue", "navy", "purple"]}
                circleSize={20}
                onChangeComplete={(colore) => onColorStateChange(colore.hex)}
              />
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={editTask}>
          Edit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
