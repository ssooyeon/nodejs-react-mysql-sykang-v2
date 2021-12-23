import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Row, Col, Button, FormGroup, InputGroup, Input, Label } from "reactstrap";

import Widget from "../../components/Widget";
import s from "./Board.module.scss";

import { createBoard, updateBoard } from "../../actions/boards";
import BoardService from "../../services/BoardService";

export default function EditBoard(props) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialBoardState = {
    id: null,
    title: "",
    content: "",
    userId: null,
  };

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
        setCurrentBoard(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 게시글 input 값 변경 시 currentBoard에 적용
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBoard({ ...currentBoard, [name]: value });
  };

  // 게시글 수정
  const doEditBoard = () => {
    if (currentBoard.title === "") {
      setIsShowErrAlert(true);
      setErrMessage("Title field is empty.");
    } else if (currentBoard.content === "") {
      setIsShowErrAlert(true);
      setErrMessage("Content field is empty.");
    } else {
      dispatch(updateBoard(currentBoard.id, currentBoard))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Post updated successfully.");

          setTimeout(() => {
            props.history.push(`/app/board/detail/${props.match.params.id}`);
          }, 500);
        })
        .catch((e) => {
          console.log(e);
        });
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
                    <Input
                      id="content"
                      className="input-transparent pl-3"
                      value={currentBoard.content}
                      onChange={handleInputChange}
                      rows={15}
                      type="textarea"
                      required
                      name="content"
                      placeholder="content"
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
