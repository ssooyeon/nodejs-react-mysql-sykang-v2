import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Button } from "reactstrap";
import { css } from "glamor";
import { confirmAlert } from "react-confirm-alert";

import "react-confirm-alert/src/react-confirm-alert.css";
import Widget from "../../components/Widget";
import s from "./UserGroup.module.scss";

import { retrieveUsers, deleteUser } from "../../actions/users";
import { retrieveGroups, deleteGroup } from "../../actions/groups";
import AddUserModal from "./user/AddUserModal";
import EditUserModal from "./user/EditUserModal";
import AddGroupModal from "./group/AddGroupModal";
import EditGroupModal from "./group/EditGroupModal";

export default function Static() {
  const users = useSelector((state) => state.users || []);
  const groups = useSelector((state) => state.groups || []);

  const dispatch = useDispatch();

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

  // 사용자 등록 버튼 클릭 및 AddUserModal.js에서 닫기 버튼 클릭
  const handleUserAddModalClick = (value, isDone) => {
    setUserAddModalOpen(value);
  };

  // 사용자 수정 버튼 클릭 및 EditUserModal.js 닫기 버튼 클릭
  const handleUserEditModalClick = (value, isDone) => {
    setUserEditModalOpen(value);
    // 사용자 수정이 완료되었으면 사용자 목록 재조회
    if (isDone) {
      dispatch(retrieveUsers());
    }
  };

  // 사용자 테이블의 Edit 버튼 클릭
  const onUserEditClick = (row) => {
    setUserEditModalOpen(true);
    setEditUser(row);
  };

  // 사용자 테이블의 Delete 버튼 클릭
  const onUserDeleteClick = (userId) => {
    confirmAlert({
      closeOnClickOutside: false,
      title: "",
      message: "Are you sure delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(deleteUser(userId));
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      overlayClassName: css({
        background: "transparent !important",
      }),
    });
  };

  // 그룹 등록 버튼 클릭 및 AddGroupModal.js에서 닫기 버튼 클릭
  const handleGroupAddModalClick = (value, isDone) => {
    setGroupAddModalOpen(value);
  };

  // 그룹 수정 버튼 클릭 및 EditGroupModal.js 닫기 버튼 클릭
  const handleGroupEditModalClick = (value, isDone) => {
    setGroupEditModalOpen(value);
    // 그룹 수정이 완료되었으면 그룹 목록 재조회
    if (isDone) {
      dispatch(retrieveUsers());
      dispatch(retrieveGroups());
    }
  };

  // 그룹 테이블의 Edit 버튼 클릭
  const onGroupEditClick = (row) => {
    setGroupEditModalOpen(true);
    setEditGroup(row);
  };

  // 그룹 테이블의 Delete 버튼 클릭
  const onGroupDeleteClick = (groupId) => {
    confirmAlert({
      closeOnClickOutside: false,
      title: "",
      message: "Are you sure delete this group with all members?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(deleteGroup(groupId));
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      overlayClassName: css({
        background: "transparent !important",
      }),
    });
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
                <tbody>
                  {users &&
                    users.map((user, key) => {
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
                <tbody>
                  {groups &&
                    groups.map((group, key) => {
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
            </div>
          </Widget>
        </Col>
      </Row>

      <AddUserModal open={userAddModalOpen} handleCloseClick={handleUserAddModalClick} />
      <EditUserModal open={userEditModalOpen} handleCloseClick={handleUserEditModalClick} user={editUser} />

      <AddGroupModal open={groupAddModalOpen} handleCloseClick={handleGroupAddModalClick} />
      <EditGroupModal open={groupEditModalOpen} handleCloseClick={handleGroupEditModalClick} group={editGroup} />
    </div>
  );
}
