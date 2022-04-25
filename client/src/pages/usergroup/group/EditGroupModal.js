import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import PaginationComponent from "react-reactstrap-pagination";

import s from "./Group.module.scss";

import { createAlarmWithGroup, retrieveAlarmByUser } from "../../../actions/alarms";
import { updateGroup, updateGroupMember } from "../../../actions/groups";
import UserService from "../../../services/UserService";
import GroupService from "../../../services/GroupService";

const pageSize = 5;

export default function EditGroupModal({ open, handleCloseClick, group }) {
  const initialGroupState = {
    name: "",
    description: "",
    users: [],
  };

  const { user: currentUser } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [groupForm, setGroupForm] = useState(initialGroupState);
  const [selectionRow, setSelectionRow] = useState([]);

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 사용자 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 사용자 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 사용자 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 사용자 등록에 실패했을 때의 에러 메시지

  const [membersCurrentPage, setMembersCurrentPage] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    setGroupForm(group);
    // 그룹 멤버
    let userIds = group.users && group.users.map((obj) => obj.id);
    setSelectionRow(userIds);
    // 전체 사용자 목록 조회
    UserService.getAll()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((e) => console.log(e));
  }, [group]);

  // 사용자 테이블 페이징
  const handleMemberTablePaging = (selectedPage) => {
    setMembersCurrentPage(selectedPage - 1);
  };

  // 닫기 버튼 클릭
  const handleClose = () => {
    handleCloseClick(false);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // 그룹 수정 완료
  const handleDone = () => {
    const isDone = true;
    handleCloseClick(false, isDone);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 group state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupForm({ ...groupForm, [name]: value });
  };

  // 멤버 테이블에서 사용자 선택
  const handleUserRowClick = (userId) => {
    if (!selectionRow.includes(userId)) {
      setSelectionRow([...selectionRow, userId]);
    } else {
      setSelectionRow(selectionRow.filter((x) => x !== userId));
    }
  };

  // 그룹 수정 수행
  const doEditGroup = (e) => {
    e.preventDefault();
    const name = groupForm.name;
    if (name !== "") {
      GroupService.findByName(name).then((res) => {
        // 현재 그룹의 원래 이름이 아니고, 다른 그룹의 이름일 때 (중복일 때)
        if (res.data !== "" && res.data !== undefined && res.data.id !== groupForm.id) {
          setIsShowErrAlert(true);
          setIsShowSuccessAlert(false);
          setErrMessage("This name already exist.");
        } else {
          doEdit();
        }
      });
    }
  };

  // 그룹 수정
  const doEdit = () => {
    const oldMemberIds = groupForm.users && groupForm.users.map((obj) => obj.id);
    const isSameMember = JSON.stringify(oldMemberIds.sort()) === JSON.stringify(selectionRow.sort());
    dispatch(updateGroup(groupForm.id, groupForm))
      .then(() => {
        // 그룹 멤버가 변경되엇다면
        if (!isSameMember) {
          let data = { ...groupForm, users: selectionRow };
          dispatch(updateGroupMember(data.id, data))
            .then(() => {
              // 그룹 멤버 수정 시 그룹 멤버들에게 알람
              const id = { userId: null, groupId: groupForm.id };
              const alarm = {
                message: `Your group member list has been modified.`,
                status: "INFO",
              };
              dispatch(createAlarmWithGroup({ id: id, alarm: alarm }));
            })
            .catch((e) => console.log(e));
        } else {
          // 그룹 수정 시 그룹 멤버들에게 알람
          const id = { userId: null, groupId: groupForm.id };
          const alarm = {
            message: `Your group has been modified.(name: ${groupForm.name})`,
            status: "INFO",
          };
          dispatch(createAlarmWithGroup({ id: id, alarm: alarm }));
        }
        setIsShowSuccessAlert(true);
        setIsShowErrAlert(false);
        setSuccessMessage("Group update with members successfully.");

        setTimeout(() => {
          handleDone();
          // 로그인한 유저의 알람 리스트 재조회 (header)
          dispatch(retrieveAlarmByUser(currentUser.id));
        }, 500);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Edit Group</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={doEditGroup}>
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
            <Label for="name">Name</Label>
            <InputGroup className="input-group-no-border">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="la la-user text-white" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="name"
                className="input-transparent pl-3"
                value={groupForm.name}
                onChange={handleInputChange}
                type="text"
                required
                name="name"
                placeholder="Name"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <InputGroup className="input-group-no-border">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="la la-table text-white" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="description"
                className="input-transparent pl-3"
                value={groupForm.description}
                onChange={handleInputChange}
                type="description"
                required
                name="description"
                placeholder="Description"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <div>
              <Table className="table-striped">
                <thead>
                  <tr>
                    <th>
                      {/* <div className="abc-checkbox">
                        <Input
                          id="checkbox1"
                          type="checkbox"
                          checked={false}
                          onChange={()=>{}}
                        />
                        <Label for="checkbox1" />
                      </div> */}
                    </th>
                    <th>#</th>
                    <th>Account</th>
                    <th>Email</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody>
                  {users &&
                    users.slice(membersCurrentPage * pageSize, (membersCurrentPage + 1) * pageSize).map((user) => {
                      return (
                        <tr key={user.id}>
                          <td>
                            <div className="abc-checkbox">
                              <Input
                                id={`checkbox-${user.id}`}
                                type="checkbox"
                                checked={selectionRow && selectionRow.includes(user.id)}
                                onChange={(e) => {
                                  handleUserRowClick(user.id);
                                }}
                              />
                              <Label for={`checkbox-${user.id}`} />
                            </div>
                          </td>
                          <td>{user.id}</td>
                          <td>{user.account}</td>
                          <td>
                            <a href="#">{user.email}</a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
                {/* eslint-enable */}
              </Table>
            </div>
          </FormGroup>
        </form>
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
            onSelect={handleMemberTablePaging}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="mr-2" size="sm" onClick={doEditGroup}>
          Edit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
