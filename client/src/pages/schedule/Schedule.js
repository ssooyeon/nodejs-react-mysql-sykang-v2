import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import rrulePlugin from "@fullcalendar/rrule";

import { Row, Col, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from "reactstrap";

import Widget from "../../components/Widget";
import Toggle from "./components/Toggle";
import s from "./Schedule.module.scss";
import "./Schedule.css";

import { retrieveSchedules, updateSchedule } from "../../actions/schedules";
import { retrieveGroups } from "../../actions/groups";
import ScheduleService from "../../services/ScheduleService";
import AddScheduleModal from "./AddScheduleModal";

const weekAbbr = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const groupInitState = {
  id: "",
  name: "",
  description: "",
  users: [],
};

export default function Schedule(props) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const schedules = useSelector((state) => state.schedules || []);
  const groups = useSelector((state) => state.groups || []);
  const dispatch = useDispatch();

  const [clickedDate, setClickedDate] = useState(new Date());
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false); // schedule create modal open
  const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false); // schedule update modal open
  const [editSchedule, setEditSchedule] = useState([]); // update 할 schedule object

  const [selectedGroup, setSelectedGroup] = useState(groupInitState); // 선택된 그룹 object
  const [selectedUserIds, setSelectedUserIds] = useState([]); // 선택된 그룹에서 선택된 사용자 ID list(viewMode: users)
  const [selectedGroupIds, setSelectedGroupIds] = useState([]); // 선택된 그룹 ID list (viewMode: groups)

  const [isUserView, setIsUserView] = useState(true); // 모드 설정: 사용자 별 검색이 기본

  useEffect(() => {
    dispatch(retrieveGroups());
  }, [dispatch]);

  useEffect(() => {
    if (groups.length > 0) {
      console.log(groups);
      loadCurrentUserSchedule(isUserView);
    }
  }, [groups]);

  // isUserView===true 때, currentUser의 group의 schedule을 모두 표출(기본)
  const loadCurrentUserSchedule = (isUser) => {
    const currentGroupId = currentUser.groupId;
    if (!isUser) {
      setSelectedGroupIds([currentUser.groupId]);
    }
    const currentGroup = groups.find((x) => x.id === currentGroupId);
    console.log(currentGroupId);
    setSelectedGroup(currentGroup);

    const selectUserIds = currentGroup.users.map((obj) => obj.id);
    setSelectedUserIds(selectUserIds);

    searchSchedule(selectUserIds, currentGroup);
  };

  /************************************** search ************************************** */

  // toggle button click
  const handleToggle = (e) => {
    const isUser = e.target.checked;
    setIsUserView(isUser);
    setSelectedGroupIds([]);
    setSelectedUserIds([]);
    loadCurrentUserSchedule(isUser);
  };

  // isUserView===true에서 group select option 변경
  const handleGroupSelectChange = (e) => {
    const selectId = e.target.value;
    // if All group
    if (selectId === "") {
      setSelectedGroup(groupInitState); // groupInitState의 id는 ""이므로 searchSchedule에서 전체 조회가 가능
      setSelectedUserIds([]);
    } else {
      // 선택한 그룹 setSeletedGroup에 저장
      const selectGroup = groups.find((x) => x.id === parseInt(selectId));
      setSelectedGroup(selectGroup);
      // 그룹 변경 시 기본적으로 해당 그룹 멤버 전체 선택
      const selectUserIds = selectGroup.users && selectGroup.users.map((obj) => obj.id);
      setSelectedUserIds(selectUserIds);
    }
  };

  // isUserView===true에서 사용자 전체 체크박스 클릭
  const handleUserAllCheckbox = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const selectUserIds = selectedGroup.users && selectedGroup.users.map((obj) => obj.id);
      setSelectedUserIds(selectUserIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  //isUserView===false에서 그룹 전체 체크박스 클릭
  const handleGroupAllCheckbox = (e) => {
    const checked = e.target.checked;
    if (checked) {
      // group all이 체크되어 있으면 모든 그룹의 모든 유저들을 setSelectedUserIds에 삽입
      const selectedGroupIds = groups.map((obj) => obj.id);
      setSelectedGroupIds(selectedGroupIds);
      let userIdArr = [];
      for (let idx in groups) {
        const users = groups[idx].users;
        const userIds = users.map((obj) => obj.id);
        userIdArr = [...userIdArr, ...userIds];
      }
      setSelectedUserIds(userIdArr);
    } else {
      setSelectedGroupIds([]);
      setSelectedUserIds([]);
    }
  };

  // isUserView===true에서 사용자 체크박스 클릭
  const handleUserCheckbox = (e) => {
    const checkedId = parseInt(e.target.value);
    const checked = e.target.checked;
    if (checked) {
      // checkbox가 체크되었으면 userIds에 추가
      setSelectedUserIds([...selectedUserIds, checkedId]);
    } else {
      // checkbox가 해제되었으면 userIds에서 삭제
      setSelectedUserIds(selectedUserIds.filter((id) => id !== checkedId));
    }
  };

  // isUserView===false에서 그룹 체크박스 클릭
  const handleGroupCheckbox = (e) => {
    const checkedId = parseInt(e.target.value);
    const checked = e.target.checked;

    const checkedGroup = groups.find((x) => x.id === checkedId);
    const users = checkedGroup.users;
    const userIds = users.map((obj) => obj.id);
    if (checked) {
      setSelectedGroupIds([...selectedGroupIds, checkedId]);
      // checkbox가 체크되었으면 체크된 그룹의 user들을 selectedUserIds에 추가
      setSelectedUserIds([...selectedUserIds, ...userIds]);
    } else {
      setSelectedGroupIds(selectedGroupIds.filter((id) => id !== checkedId));
      // checkbox가 해제되었으면 해제된 그룹의 user들을 selectedUserIds에서 찾아서 삭제
      setSelectedUserIds(selectedUserIds.filter((x) => userIds.indexOf(x) < 0));
    }
  };

  // isUserView===true에서 선택한 사용자에 따른 스케줄 목록 재 조회
  const searchSchedule = (users, groups) => {
    let idParam = users.join(",");
    // All group이 선택되어 있는 경우 모든 스케줄을 표출
    if (isUserView && groups.id === "") {
      dispatch(retrieveSchedules());
    } else {
      // 선택된 사용자가 없는 경우
      if (idParam === "") {
        idParam = "[]";
      }
      const params = {
        userIdsStr: idParam,
      };
      dispatch(retrieveSchedules(params));
    }
  };

  /********************************** calendar inner ********************************** */

  // 날짜 클릭: 신규 스케줄 추가 팝업 오픈
  const handleDateSelect = (e) => {
    setClickedDate(e.start);
    setAddScheduleModalOpen(true);
  };

  // 기존 스케줄 클릭: 스케줄 수정 팝업 오픈
  const handleEventClick = (e) => {};

  // 신규 스케줄 추가 후 콜백 함수
  const handleEventAdd = (e) => {
    console.log("add");
  };

  // 스케줄 드래그/리사이즈 후 콜백 함수
  const handleEventChange = (e) => {};

  // 스케줄 삭제 후 콜백 함수
  const handleEventRemove = (e) => {};

  // 스케줄 렌더링 전 호출 함수
  const handleEventContent = (e) => {
    const calMode = e.view.type;
    if (calMode === "dayGridMonth") {
      const timeText = e.timeText;
      const creater = e.event.extendedProps.creater;
      // isUserView에 따라 그룹명 또는 사용자 계정명 표출
      let text = "";
      if (isUserView) {
        if (creater !== undefined) {
          text = creater.account;
        } else {
          text = currentUser.account;
        }
      } else if (!isUserView) {
        const currentGroup = groups.find((x) => x.id === creater.groupId);
        text = currentGroup.name;
      }

      // 반복 일정인 경우 아이콘 추가
      const recurringDef = e.event._def.recurringDef;
      let repeatHtml = "";
      if (recurringDef !== null) {
        const rrule = recurringDef.typeData.rruleSet.toString();
        if (rrule !== null) {
          repeatHtml = "<i class='fa fa-repeat'></i>&nbsp;";
        }
      }

      let html = "";
      // all day 일정이면 반복 아이콘+텍스트
      if (timeText === "") {
        html =
          "<div class='fc-event-time'>" +
          timeText +
          "</div>" +
          "<div class='fc-event-title'>" +
          repeatHtml +
          e.event.title +
          "</div>" +
          "<div style='font-size:11px;float:right;margin-right:3px;font-style:italic;'>" +
          text +
          "</div>";
      }
      // 시간 범위가 있는 일정이면 원형 그림 + 반복 아이콘 + 시간 + 텍스트(account or group name)
      else {
        html =
          "<div class='fc-daygrid-event-dot' style='border-color: " +
          e.event.backgroundColor +
          ";'></div>" +
          repeatHtml +
          "<div class='fc-event-time'>" +
          timeText +
          "</div>" +
          "<div class='fc-event-title'>" +
          e.event.title +
          "</div>" +
          "<div style='font-size:11px;float:right;margin-right:3px;font-style:italic;'>" +
          text +
          "</div>";
      }
      return {
        html: html,
      };
    }
  };

  // 드래그/리사이즈 실행 직전
  const handleEventAllow = (e) => {};

  // 스케줄 등록 버튼 클릭 및 AddScheduleForm.js 에서 닫기 버튼 클릭
  const handleAddScheduleModalClick = (value, isDone) => {
    setAddScheduleModalOpen(value);
    // 스케줄 신규 등록이 완료되었고, 표출된 스케줄에 current user가 없으면 강제로 current user의 group의 스케줄을 표출
    if (isDone && selectedUserIds.find((x) => x !== currentUser.id)) {
      loadCurrentUserSchedule(isUserView);
    }
  };

  // 스케줄 수정 버튼 클릭 및 EditScheduleForm.js 에서 닫기 버튼 클릭
  const handleEditScheduleModalClick = (value) => {
    setEditScheduleModalOpen(value);
  };

  return (
    <>
      <div className={s.root}>
        <h2 className="page-title">
          Calendar - <span className="fw-semi-bold">Schedule</span>
        </h2>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Widget>
              <h3>
                <span className="fw-semi-bold">My Schedule</span>
                <div className={s.toggleLabel}>
                  <Toggle
                    checked={isUserView}
                    text={isUserView ? "users" : "groups"}
                    size="default"
                    disabled={false}
                    onChange={handleToggle}
                    offstyle="btn-danger"
                    onstyle="btn-success"
                  />
                </div>
              </h3>
              <p>
                {"Indicates a To-Do of "}
                <code>my schedule</code> with title, description, date.
              </p>
              <div style={{ display: "flex" }}>
                {isUserView ? (
                  <>
                    <InputGroup className="input-group-no-border" style={{ width: "250px" }}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="la la-group text-white" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="group"
                        className="input-transparent pl-3"
                        type="select"
                        name="group"
                        value={selectedGroup.id || ""}
                        onChange={handleGroupSelectChange}
                      >
                        {groups &&
                          groups.map((group, index) => {
                            return (
                              <option value={group.id} key={group.id}>
                                {group.name}
                              </option>
                            );
                          })}
                      </Input>
                    </InputGroup>
                    <div style={{ marginTop: "7px", marginLeft: "10px" }}>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.length === selectedGroup.users.length}
                        onChange={(e) => handleUserAllCheckbox(e)}
                      />
                      <label>&nbsp; ALL &nbsp;</label>
                      {selectedGroup.users &&
                        selectedGroup.users.map((item, index) => {
                          return (
                            <>
                              <input
                                type="checkbox"
                                key={item.id}
                                value={item.id}
                                checked={selectedUserIds.includes(item.id)}
                                onChange={(e) => handleUserCheckbox(e)}
                              />
                              <label>&nbsp; {item.account} &nbsp;</label>
                            </>
                          );
                        })}
                    </div>

                    <Button color="inverse" className="mr-2" size="xs" onClick={() => searchSchedule(selectedUserIds, selectedGroup)}>
                      load
                    </Button>
                  </>
                ) : (
                  <>
                    <div style={{ marginTop: "7px", marginLeft: "10px" }}>
                      <input type="checkbox" checked={selectedGroupIds.length === groups.length} onChange={(e) => handleGroupAllCheckbox(e)} />
                      <label>&nbsp; ALL &nbsp;</label>
                      {groups &&
                        groups.map((item, index) => {
                          return (
                            <>
                              <input
                                type="checkbox"
                                key={item.id}
                                value={item.id}
                                checked={selectedGroupIds.includes(item.id)}
                                onChange={(e) => handleGroupCheckbox(e)}
                              />
                              <label>&nbsp; {item.name} &nbsp;</label>
                            </>
                          );
                        })}
                    </div>
                    <Button color="inverse" className="mr-2" size="xs" onClick={() => searchSchedule(selectedUserIds, selectedGroup)}>
                      load
                    </Button>
                  </>
                )}
              </div>
              <br />
              <div className={s.overFlow}>
                <FullCalendar
                  plugins={[dayGridPlugin, rrulePlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  fixedWeekCount={false}
                  select={handleDateSelect}
                  events={schedules}
                  eventClick={handleEventClick}
                  eventAdd={handleEventAdd}
                  eventChange={handleEventChange}
                  eventRemove={handleEventRemove}
                  eventContent={handleEventContent}
                  eventAllow={handleEventAllow}
                  contentHeight={600}
                />
              </div>
              <br />
            </Widget>
          </Col>
        </Row>
      </div>
      <AddScheduleModal open={addScheduleModalOpen} handleCloseClick={handleAddScheduleModalClick} date={clickedDate} />
    </>
  );
}
