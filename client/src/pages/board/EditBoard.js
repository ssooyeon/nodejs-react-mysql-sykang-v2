import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Row, Col, Button, FormGroup, InputGroup, Input, Label } from "reactstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import Widget from "../../components/Widget";
import s from "./Board.module.scss";

import { updateBoard } from "../../actions/boards";
import BoardService from "../../services/BoardService";

export default function EditBoard(props) {
  const initialBoardState = {
    id: null,
    title: "",
    content: "",
    userId: null,
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // description editor
  const [currentBoard, setCurrentBoard] = useState(initialBoardState);
  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 게시글 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 게시글 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 게시글 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 게시글 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  useEffect(() => {
    getBoard(props.match.params.id);
  }, [props.match.params.id]);

  // 현재 게시글 가져오기
  const getBoard = (id) => {
    BoardService.get(id)
      .then((res) => {
        const boardForm = res.data;
        setCurrentBoard(boardForm);
        if (boardForm.content !== undefined) {
          // 에디터에 html 바인딩
          const blocksFromHtml = htmlToDraft(boardForm.content);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
          const data = EditorState.createWithContent(contentState);
          setEditorState(data);
        }
      })
      .catch((e) => console.log(e));
  };

  // 게시글 input 값 변경 시 currentBoard에 적용
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBoard({ ...currentBoard, [name]: value });
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

  // 게시글 수정
  const doEditBoard = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markup = draftToHtml(rawContentState);

    if (currentBoard.title === "") {
      setIsShowErrAlert(true);
      setErrMessage("Title field is empty.");
    } else if (markup.trim() === "<p></p>") {
      setIsShowErrAlert(true);
      setErrMessage("Content field is empty.");
    } else {
      const data = { ...currentBoard, content: markup };
      dispatch(updateBoard(data.id, data))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Post updated successfully.");

          setTimeout(() => {
            props.history.push(`/app/board/detail/${props.match.params.id}`);
          }, 500);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Tables - <span className="fw-semi-bold">Board</span>
      </h2>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Edit Post</span>
            </h3>
            <p>
              {"Indicates a list of "}
              Please fill all fields below.
            </p>
            <div>
              <form onSubmit={doEditBoard}>
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
                      value={currentBoard.title}
                      onChange={handleInputChange}
                      type="text"
                      required
                      name="title"
                      placeholder="title"
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mt">
                  <Label for="content">Content</Label>
                  <InputGroup className="input-group-no-border">
                    <Editor
                      editorStyle={{
                        border: "1px solid #C0C0C0",
                        height: "350px",
                        padding: "5px",
                        fontSize: "14px",
                        width: "1580px",
                      }}
                      id="description"
                      name="description"
                      value={currentBoard.content}
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
                </FormGroup>
              </form>
              <br />
              <Link to={`/app/board/detail/${props.match.params.id}`}>
                <Button color="inverse" className="mr-2" size="sm">
                  Back
                </Button>
              </Link>
              <Button color="danger" className="mr-2" size="sm" onClick={doEditBoard}>
                Edit
              </Button>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
