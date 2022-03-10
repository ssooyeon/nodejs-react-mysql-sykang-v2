import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import Swal from "sweetalert2";

import Widget from "../../components/Widget";
import s from "./Board.module.scss";

import { retrieveBoard, deleteBoard } from "../../actions/boards";

export default function BoardDetail(props) {
  const { user: currentUser } = useSelector((state) => state.auth);
  const boards = useSelector((state) => state.boards);
  const dispatch = useDispatch();

  useEffect(() => {
    const id = props.match.params.id;
    dispatch(retrieveBoard(id));
  }, [dispatch, props.match.params.id]);

  // 게시글 삭제 전 확인
  const confirmRemovePost = () => {
    Swal.fire({
      text: "Are you sure delete this post?",
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
        doRemovePost();
      }
    });
  };

  // 게시글 삭제 수행
  const doRemovePost = () => {
    const id = props.match.params.id;
    dispatch(deleteBoard(id))
      .then(() => {
        props.history.push("/app/board");
      })
      .catch((e) => {
        console.log(e);
      });
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
              <span className="fw-semi-bold">Post Detail</span>
              {boards.user && currentUser.id === boards.user.id ? (
                <div className="float-right">
                  <Link to={`/app/board/edit/${boards.id}`}>
                    <Button color="default" className="mr-2" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button color="danger" className="mr-2" size="sm" onClick={confirmRemovePost}>
                    Remove
                  </Button>
                </div>
              ) : null}
            </h3>
            <p>
              {"Indicates a list of "}
              <code>detail information</code> on post.
            </p>
            <div>
              <blockquote>
                <div>
                  <span className="mt-5" style={{ fontSize: "1.75rem", fontWeight: 300 }}>
                    {boards.title}
                  </span>
                  <div className="float-right">
                    {boards.createdAt} | {boards.user && <strong>{boards.user.account}</strong>}
                  </div>
                </div>
                <br />
                <div className="widget-padding-md w-100 h-100 text-left border rounded" style={{ minHeight: "430px" }}>
                  <blockquote className="blockquote">
                    <p dangerouslySetInnerHTML={{ __html: boards.content }}></p>
                  </blockquote>
                </div>
              </blockquote>
            </div>
            <div>
              <br />
              <Link to={"/app/board"}>
                <Button color="inverse" className="mr-2" size="sm">
                  Back
                </Button>
              </Link>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
