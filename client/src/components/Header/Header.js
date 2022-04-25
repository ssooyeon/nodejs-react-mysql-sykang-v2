import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Input,
  Dropdown,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
} from "reactstrap";
import { FaTasks } from "react-icons/fa";
import { AiOutlineNotification } from "react-icons/ai";
import PowerIcon from "../Icons/HeaderIcons/PowerIcon";
import BellIcon from "../Icons/HeaderIcons/BellIcon";
import BurgerIcon from "../Icons/HeaderIcons/BurgerIcon";
import ArrowIcon from "../Icons/HeaderIcons/ArrowIcon";

import { openSidebar, closeSidebar } from "../../actions/navigation";

import s from "./Header.module.scss";
import "animate.css";

import { logout } from "../../actions/auth";
import { retrieveAlarmByUser } from "../../actions/alarms";
import TaskService from "../../services/TaskService";
import AlarmService from "../../services/AlarmService";

const searchOpen = false;
const labels = ["warning", "success", "info", "danger"];
const icons = ["fa fa-question-circle", "fa fa-info-circle", "fa fa-plus", "fa fa-tag", "fa fa-question-circle"];

function Header(props) {
  const [taskListOpen, setTaskListOpen] = useState(false); // task list window open
  const [alarmListOpen, setAlarmListOpen] = useState(false); // alarm list window open
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [taskList, setTaskList] = useState([]); // task list

  const { user: currentUser } = useSelector((state) => state.auth);
  const alarms = useSelector((state) => state.alarms || []);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(retrieveAlarmByUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser) {
      // task list
      TaskService.getAllByUser(currentUser.id)
        .then((res) => {
          setTaskList(res.data);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const doLogout = () => {
    dispatch(logout());
    props.history.push("/");
  };

  const toggleTaskDropdown = () => {
    setTaskListOpen(!taskListOpen);
  };

  const toggleAlarmDropdown = () => {
    setAlarmListOpen(!alarmListOpen);
  };

  const toggleSidebar = () => {
    props.isSidebarOpened ? dispatch(closeSidebar()) : dispatch(openSidebar());
  };

  // auto logout for inactive user using idle
  const handleOnIdle = () => {
    console.log("last active: ", getLastActiveTime());
    if (currentUser) {
      console.log("auto logout..");
      doLogout();
    }
  };
  const { getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60,
    onIdle: handleOnIdle,
    onActive: () => {},
    onAction: () => {},
    debounce: 500,
  });

  return (
    <Navbar className={`d-print-none `}>
      <div className={s.burger}>
        <NavLink onClick={toggleSidebar} className={`d-md-none ${s.navItem} text-white`} href="#">
          <BurgerIcon className={s.headerIcon} />
        </NavLink>
      </div>
      <div className={`d-print-none ${s.root}`}>
        <Collapse className={`${s.searchCollapse} ml-lg-0 mr-md-3`} isOpen={searchOpen}>
          <InputGroup className={`${s.navbarForm} ${searchFocused ? s.navbarFormFocused : ""}`}>
            <InputGroupAddon addonType="prepend" className={s.inputAddon}>
              <InputGroupText>
                <i className="fa fa-search" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id="search-input-2"
              placeholder="Search..."
              className="input-transparent"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </InputGroup>
        </Collapse>

        <Nav className="ml-md-0">
          <Dropdown nav isOpen={notificationsOpen} toggle={toggleNotifications} id="basic-nav-dropdown" className={`${s.notificationsMenu}`}>
            <DropdownToggle nav caret style={{ color: "#C1C3CF", padding: 0 }}>
              {currentUser ? (
                <>
                  <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#5c4c4c" }}>
                    <p style={{ marginTop: "1rem" }}>{currentUser.account[0].toUpperCase()}</p>
                  </span>
                  {currentUser.type !== null && currentUser.type !== undefined ? (
                    <span className={`small d-sm-down-none ${s.accountCheck}`}>{currentUser.email}</span>
                  ) : (
                    <span
                      className={`small d-sm-down-none ${s.accountCheck}`}
                      onClick={() => {
                        props.history.push("/app/profile");
                      }}
                    >
                      {currentUser.account}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#5c4c4c" }}>
                    <p style={{ marginTop: "1rem" }}>G</p>
                  </span>
                  <span className={`small d-sm-down-none ${s.accountCheck}`}>Guest</span>
                </>
              )}
            </DropdownToggle>
          </Dropdown>
          <NavItem className={`${s.divider} d-none d-sm-block`} />
          {currentUser ? (
            <>
              <Dropdown className="d-none d-sm-block" nav isOpen={taskListOpen} toggle={toggleTaskDropdown}>
                <DropdownToggle nav className={`${s.navItem} text-white`}>
                  <FaTasks size={20} className={s.headerIcon} />
                  {taskList.length > 0 ? <div className={s.count}></div> : null}
                </DropdownToggle>
                <DropdownMenu right className={`${s.dropdownMenu} ${s.support}`}>
                  {taskList &&
                    taskList.map((task, index) => {
                      return (
                        <DropdownItem key={task.id}>
                          <Badge color={labels[Math.floor(Math.random() * 4)]}>
                            <i className={icons[Math.floor(Math.random() * 5)]} />
                          </Badge>
                          {task.isDone ? (
                            <div className={s.details} style={{ textDecoration: "line-through", color: "rgba(244, 244, 245, 0.6)" }}>
                              {task.title.length > 30 ? task.title.substr(0, 30) + "..." : task.title}
                            </div>
                          ) : (
                            <div className={s.details}>{task.title.length > 30 ? task.title.substr(0, 30) + "..." : task.title}</div>
                          )}
                        </DropdownItem>
                      );
                    })}

                  {taskList.length > 0 ? (
                    <DropdownItem>
                      <a href="/#/app/task" className="text-white">
                        More <ArrowIcon className={s.headerIcon} maskName="bellArrow" />
                      </a>
                    </DropdownItem>
                  ) : null}
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="d-none d-sm-block" nav isOpen={alarmListOpen} toggle={toggleAlarmDropdown}>
                <DropdownToggle nav className={`${s.navItem} text-white`}>
                  <BellIcon className={s.headerIcon} />
                  {alarms && alarms.length > 0 ? <div className={s.countRed}></div> : null}
                </DropdownToggle>
                <DropdownMenu right className={`${s.dropdownMenu} ${s.support}`}>
                  {alarms &&
                    alarms.map((alarm, index) => {
                      return (
                        <DropdownItem key={alarm.id}>
                          <AiOutlineNotification size={20} className={s.headerIcon} />
                          <div className={s.details}>{alarm.message > 30 ? alarm.message.substr(0, 30) + "..." : alarm.message}</div>
                          {/* <Button style={{ padding: "2px 0 0 5px", color: "#e9e3e3" }} onClick={() => {}}>
                            <i className="fa fa-remove"></i>
                          </Button> */}
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </Dropdown>
            </>
          ) : null}
          <NavItem>
            {currentUser ? (
              <NavLink className={`${s.navItem} text-white`} onClick={doLogout}>
                <PowerIcon className={s.headerIcon} /> <h6 style={{ margin: "0 0 0 5px" }}>Logout</h6>
              </NavLink>
            ) : (
              <NavLink className={`${s.navItem} text-white`} href="#/login">
                <PowerIcon className={s.headerIcon} /> <h6 style={{ margin: "0 0 0 5px" }}>Login</h6>
              </NavLink>
            )}
          </NavItem>
        </Nav>
      </div>
    </Navbar>
  );
}

export default withRouter(Header);
