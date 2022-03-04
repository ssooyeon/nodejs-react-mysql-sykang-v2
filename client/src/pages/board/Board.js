import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button, FormGroup, InputGroup, Input } from "reactstrap";
import PaginationComponent from "react-reactstrap-pagination";

import Widget from "../../components/Widget";
import s from "./Board.module.scss";

import { retrieveBoards } from "../../actions/boards";

const pageSize = 8;

export default function Board() {
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");

  const boards = useSelector((state) => state.boards);
  const dispatch = useDispatch();

  useEffect(() => {
    searchBoards();
  }, [currentPage]);

  // 페이징을 위한 파라미터 가져오기
  const getReqParams = (searchTitle, page, pageSize) => {
    let params = {};
    if (searchTitle) {
      params["title"] = searchTitle;
    }
    if (page) {
      params["page"] = page;
    }
    if (pageSize) {
      params["size"] = pageSize;
    }
    return params;
  };

  // 게시판 페이징
  const handleBoardPaging = (selectedPage) => {
    setCurrentPage(selectedPage - 1);
  };

  // 게시판 검색
  const searchBoards = () => {
    const params = getReqParams(search, currentPage, pageSize);
    dispatch(retrieveBoards(params));
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
              <span className="fw-semi-bold">Board</span>
              <div className="float-right">
                <Link to={"/app/board/add"}>
                  <Button color="default" className="mr-2" size="sm">
                    Add
                  </Button>
                </Link>
              </div>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>posts</code> in the system.
            </p>
            <FormGroup className="mt">
              <InputGroup className="input-group-no-border">
                <Input
                  id="search"
                  className="input-transparent pl-3 form-control-sm"
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  required
                  name="search"
                  placeholder="Search (title)"
                />
                <Button color="inverse" className="social-button" size="xs" onClick={searchBoards}>
                  <i className="fa fa-search"></i>
                </Button>
              </InputGroup>
            </FormGroup>
            <br />
            <div style={{ display: "flex" }}>
              <Row>
                <br />
                {boards.rows &&
                  boards.rows.map((board) => {
                    return (
                      <Col lg={3} md={3} sm={12} key={board.id}>
                        <Widget>
                          <Link to={`/app/board/detail/${board.id}`}>
                            <h3>
                              <span className="fw-semi-bold">{board.title}</span>
                            </h3>
                          </Link>
                          <p>
                            {board.content.replace(/<[^>]+>/g, "").length > 400
                              ? board.content.replace(/<[^>]+>/g, "").substr(0, 400) + "..."
                              : board.content.replace(/<[^>]+>/g, "")}
                          </p>
                          <p style={{ fontSize: "12px" }}>
                            {board.user.account} / {board.createdAt}
                          </p>
                        </Widget>
                      </Col>
                    );
                  })}
              </Row>
            </div>
          </Widget>
          <div className={s.boardPaging}>
            <PaginationComponent
              size="sm"
              totalItems={boards.count || 0}
              pageSize={pageSize}
              defaultActivePage={1}
              firstPageText="<<"
              previousPageText="<"
              nextPageText=">"
              lastPageText=">>"
              onSelect={handleBoardPaging}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
