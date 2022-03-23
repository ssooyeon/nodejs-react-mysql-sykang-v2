import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Button, FormGroup, InputGroup, Input } from "reactstrap";
import PaginationComponent from "react-reactstrap-pagination";
import Swal from "sweetalert2";

import Widget from "../../components/Widget";
import s from "./UserGroup.module.scss";

import { retrieveUsers, deleteUser } from "../../actions/users";
import { retrieveGroups, deleteGroup } from "../../actions/groups";
import AddUserModal from "./user/AddUserModal";
import EditUserModal from "./user/EditUserModal";
import AddGroupModal from "./group/AddGroupModal";
import EditGroupModal from "./group/EditGroupModal";

const pageSize = 8;

export default function Static() {
  const users = useSelector((state) => state.users || []);
  const groups = useSelector((state) => state.groups || []);

  const dispatch = useDispatch();

  const [searchUserInput, setSearchUserInput] = useState(null);
  const [searchGroupInput, setSearchGroupInput] = useState(null);

  const [usersCurrentPage, setUsersCurrentPage] = useState(0);
  const [groupsCurrentPage, setGroupsCurrentPage] = useState(0);

  const [userAddModalOpen, setUserAddModalOpen] = useState(false);
  const [userEditModalOpen, setUserEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState([]);

  const [groupAddModalOpen, setGroupAddModalOpen] = useState(false);
  const [groupEditModalOpen, setGroupEditModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState([]);

  useEffect(() => {
    dispatch(retrieveUsers());
    dispatch(retrieveGroups());
  }, [dispatch]);

  // 사용자 테이블 페이징
  const handleUserTablePaging = (selectedPage) => {
    setUsersCurrentPage(selectedPage - 1);
  };

  // 사용자 등록 버튼 클릭 및 AddUserModal.js에서 닫기 버튼 클릭
  const handleUserAddModalClick = (value, isDone) => {
    setUserAddModalOpen(value);
    if (isDone) {
      resetInputAndRetrieve();
    }
  };

  // 사용자 수정 버튼 클릭 및 EditUserModal.js 닫기 버튼 클릭
  const handleUserEditModalClick = (value, isDone) => {
    setUserEditModalOpen(value);
    // 사용자 수정이 완료되었으면 사용자 목록 재조회
    if (isDone) {
      searchUser();
      searchGroup();
    }
  };

  // 사용자 테이블의 Edit 버튼 클릭
  const onUserEditClick = (row) => {
    setUserEditModalOpen(true);
    setEditUser(row);
  };

  // 사용자 테이블의 Delete 버튼 클릭
  const onUserDeleteClick = (userId) => {
    Swal.fire({
      text: "Are you sure delete this user?",
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
        dispatch(deleteUser(userId));
      }
    });
  };

  // 사용자 검색
  const searchUser = () => {
    const params = { account: searchUserInput };
    dispatch(retrieveUsers(params));
  };

  // 그룹 테이블 페이징
  const handleGroupTablePaging = (selectedPage) => {
    setGroupsCurrentPage(selectedPage - 1);
  };

  // 그룹 등록 버튼 클릭 및 AddGroupModal.js에서 닫기 버튼 클릭
  const handleGroupAddModalClick = (value, isDone) => {
    setGroupAddModalOpen(value);
  };
  // 그룹 등록이 실제로 이루어지면 search input 초기화
  const handleGroupResetInput = (isReset) => {
    if (isReset) {
      resetInputAndRetrieve();
    }
  };

  // 그룹 수정 버튼 클릭 및 EditGroupModal.js 닫기 버튼 클릭
  const handleGroupEditModalClick = (value, isDone) => {
    setGroupEditModalOpen(value);
    // 그룹 수정이 완료되었으면 그룹 목록 재조회
    if (isDone) {
      searchUser();
      searchGroup();
    }
  };

  // 그룹 테이블의 Edit 버튼 클릭
  const onGroupEditClick = (row) => {
    setGroupEditModalOpen(true);
    setEditGroup(row);
  };

  // 그룹 테이블의 Delete 버튼 클릭
  const onGroupDeleteClick = (groupId) => {
    Swal.fire({
      text: "Are you sure delete this group with all members?",
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
        dispatch(deleteGroup(groupId));
      }
    });
  };

  // 그룹 검색
  const searchGroup = () => {
    const params = { name: searchGroupInput };
    dispatch(retrieveGroups(params));
  };

  // 사용자 검색어, 그룹 검색어 초기화 및 전체 재조회
  const resetInputAndRetrieve = () => {
    setSearchUserInput(null);
    setSearchGroupInput(null);
    dispatch(retrieveUsers());
    dispatch(retrieveGroups());
  };

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Tables - <span className="fw-semi-bold">Users & Groups</span>
      </h2>
      <Row>
        <Col lg={6} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Users</span>
              <div className="float-right">
                <Button color="default" className="mr-2" size="sm" onClick={() => handleUserAddModalClick(true)}>
                  Add
                </Button>
              </div>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>users</code> in the system.
            </p>
            <FormGroup className="mt">
              <InputGroup className="input-group-no-border">
                <Input
                  id="searchUserInput"
                  className="input-transparent pl-3 form-control-sm"
                  value={searchUserInput || ""}
                  onChange={(e) => setSearchUserInput(e.target.value)}
                  type="text"
                  required
                  name="searchUserInput"
                  placeholder="Search (account)"
                />
                <Button color="inverse" className="social-button" size="xs" onClick={searchUser}>
                  <i className="fa fa-search"></i>
                </Button>
              </InputGroup>
            </FormGroup>
            <br />
            <div className={s.overFlow}>
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Account</th>
                    <th>Email</th>
                    <th>Group</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody style={{ minWidth: "" }}>
                  {users &&
                    users.slice(usersCurrentPage * pageSize, (usersCurrentPage + 1) * pageSize).map((user) => {
                      return (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.account}</td>
                          <td>
                            <a href="#">{user.email}</a>
                          </td>
                          <td>{user.group ? user.group.name : "-"}</td>
                          <td>{user.createdAt}</td>
                          <td>
                            <Button color="default" className="mr-2" size="xs" onClick={(e) => onUserEditClick(user)}>
                              E
                            </Button>
                            <Button color="inverse" className="mr-2" size="xs" onClick={(e) => onUserDeleteClick(user.id)}>
                              D
                            </Button>
                          </td>
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
          </Widget>
        </Col>
        <Col lg={6} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Groups</span>
              <div className="float-right">
                <Button color="default" className="mr-2" size="sm" onClick={() => handleGroupAddModalClick(true)}>
                  Add
                </Button>
              </div>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>groups</code> in the system.
            </p>
            <FormGroup className="mt">
              <InputGroup className="input-group-no-border">
                <Input
                  id="searchGroupInput"
                  className="input-transparent pl-3 form-control-sm"
                  value={searchGroupInput || ""}
                  onChange={(e) => setSearchGroupInput(e.target.value)}
                  type="text"
                  required
                  name="searchGroupInput"
                  placeholder="Search (name)"
                />
                <Button color="inverse" className="social-button" size="xs" onClick={searchGroup}>
                  <i className="fa fa-search"></i>
                </Button>
              </InputGroup>
            </FormGroup>
            <br />
            <div className={s.overFlow}>
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody style={{ minWidth: "" }}>
                  {groups &&
                    groups.slice(groupsCurrentPage * pageSize, (groupsCurrentPage + 1) * pageSize).map((group) => {
                      return (
                        <tr key={group.id}>
                          <td>{group.id}</td>
                          <td>{group.name}</td>
                          <td>{group.createdAt}</td>
                          <td>
                            <Button color="default" className="mr-2" size="xs" onClick={(e) => onGroupEditClick(group)}>
                              E
                            </Button>
                            <Button color="inverse" className="mr-2" size="xs" onClick={(e) => onGroupDeleteClick(group.id)}>
                              D
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
                {/* eslint-enable */}
              </Table>
              <div className={s.groupPaging}>
                <PaginationComponent
                  size="sm"
                  totalItems={groups.length}
                  pageSize={pageSize}
                  defaultActivePage={1}
                  firstPageText="<<"
                  previousPageText="<"
                  nextPageText=">"
                  lastPageText=">>"
                  onSelect={handleGroupTablePaging}
                />
              </div>
            </div>
          </Widget>
        </Col>
      </Row>

      <AddUserModal open={userAddModalOpen} handleCloseClick={handleUserAddModalClick} />
      <EditUserModal open={userEditModalOpen} handleCloseClick={handleUserEditModalClick} user={editUser} />

      <AddGroupModal open={groupAddModalOpen} handleCloseClick={handleGroupAddModalClick} handleResetInput={handleGroupResetInput} />
      <EditGroupModal open={groupEditModalOpen} handleCloseClick={handleGroupEditModalClick} group={editGroup} />
    </div>
  );
}
