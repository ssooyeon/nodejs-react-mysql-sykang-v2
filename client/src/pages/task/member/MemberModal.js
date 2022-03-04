import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Modal, ModalBody, ModalFooter, Table } from "reactstrap";
import PaginationComponent from "react-reactstrap-pagination";

import { updateSharedUser } from "../../../actions/folders";
import UserService from "../../../services/UserService";

import s from "./MemberModal.module.scss";

const pageSize = 5;

export default function MemberModal({ open, handleCloseClick, userFolder }) {
  const [users, setUsers] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchUserInput, setSearchUserInput] = useState(null);
  const [usersCurrentPage, setUsersCurrentPage] = useState(0);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 게시글 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 게시글 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 게시글 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 게시글 등록에 실패했을 때의 에러 메시지

  useEffect(() => {
    UserService.getAll()
      .then((res) => {
        setUsers(res.data);
        let currentUserIds = userFolder.users && userFolder.users.map((obj) => obj.id);
        setSelectionModel(currentUserIds);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [userFolder]);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // 사용자 테이블 페이징
  const handleUserTablePaging = (selectedPage) => {
    setUsersCurrentPage(selectedPage - 1);
  };

  // 사용자 테이블에서 checkbox 클릭
  const handleRowClick = (e) => {
    const clickedUserId = parseInt(e.target.value);
    // 체크박스를 해제했을 경우 selectionModel에서 삭제
    if (selectionModel.includes(clickedUserId)) {
      setSelectionModel(selectionModel.filter((x) => x !== clickedUserId));
    } else {
      // 체크박스를 체크했을 경우 selectionModel에 추가
      setSelectionModel([...selectionModel, clickedUserId]);
    }
  };

  // shared user update (upserFolder 수정)
  const addUserFolder = () => {
    const users = selectionModel;
    const checkCurrentUser = users.find((x) => x === currentUser.id);
    if (checkCurrentUser === undefined) {
      setIsShowSuccessAlert(false);
      setIsShowErrAlert(true);
      setErrMessage("Currently logged in users cannot be excluded.");
    } else {
      const data = { users };
      dispatch(updateSharedUser(userFolder.id, data))
        .then((res) => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Shared users of folders update successfully.");

          setTimeout(() => {
            handleClose();
            setSelectionModel([]);
          }, 500);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Set Shared Member</span>
        <h6 className="widget-auth-info">Please check checkbox below.</h6>
        <form onSubmit={addUserFolder}>
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
            <InputGroup className="input-group-no-border">
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th> </th>
                    <th>#</th>
                    <th>Account</th>
                    <th>Email</th>
                    <th>Group</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody>
                  {users &&
                    users.slice(usersCurrentPage * pageSize, (usersCurrentPage + 1) * pageSize).map((user) => {
                      return (
                        <tr
                          key={user.id}
                          style={{
                            background: selectionModel && selectionModel.includes(user.id) ? "rgb(57 68 98)" : "",
                          }}
                        >
                          <td>
                            <input
                              type="checkbox"
                              value={user.id}
                              checked={selectionModel && selectionModel.includes(user.id) ? true : false}
                              onChange={(e) => handleRowClick(e)}
                            />
                          </td>
                          <td>{user.id}</td>
                          <td>{user.account}</td>
                          <td>{user.email}</td>
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
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={addUserFolder}>
          Submit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
