import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Form,
  FormGroup,
} from "reactstrap";
import PowerIcon from "../Icons/HeaderIcons/PowerIcon";
import BellIcon from "../Icons/HeaderIcons/BellIcon";
import BurgerIcon from "../Icons/HeaderIcons/BurgerIcon";
import SearchIcon from "../Icons/HeaderIcons/SearchIcon";
import ArrowIcon from "../Icons/HeaderIcons/ArrowIcon";

import { openSidebar, closeSidebar } from "../../actions/navigation";

import s from "./Header.module.scss";
import "animate.css";

import { logout } from "../../actions/auth";

const searchOpen = false;

export default function Header(props) {
  const [supportOpen, setSupportOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const doLogout = () => {
    dispatch(logout());
  };

  const toggleSupportDropdown = () => {
    setSupportOpen(!supportOpen);
  };

  const toggleSidebar = () => {
    props.isSidebarOpened ? dispatch(closeSidebar()) : dispatch(openSidebar());
  };

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
        <Form className="d-md-down-none mr-3 ml-3" inline>
          <FormGroup>
            <InputGroup className={`input-group-no-border ${s.searchForm}`}>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className={s.inputGroupText}>
                  <SearchIcon className={s.headerIcon} />
                </InputGroupText>
              </InputGroupAddon>
              <Input id="search-input" className="input-transparent" placeholder="Search Dashboard" />
            </InputGroup>
          </FormGroup>
        </Form>

        <Nav className="ml-md-0">
          <Dropdown nav isOpen={notificationsOpen} toggle={toggleNotifications} id="basic-nav-dropdown" className={`${s.notificationsMenu}`}>
            <DropdownToggle nav caret style={{ color: "#C1C3CF", padding: 0 }}>
              <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#5c4c4c" }}>
                <p style={{ marginTop: "1rem" }}>S</p>
              </span>
              {currentUser ? (
                <span className={`small d-sm-down-none ${s.accountCheck}`}>{currentUser.account}</span>
              ) : (
                <span className={`small d-sm-down-none ${s.accountCheck}`}>Guest</span>
              )}
            </DropdownToggle>
          </Dropdown>
          <NavItem className={`${s.divider} d-none d-sm-block`} />
          <Dropdown className="d-none d-sm-block" nav isOpen={supportOpen} toggle={toggleSupportDropdown}>
            <DropdownToggle nav className={`${s.navItem} text-white`}>
              <BellIcon className={s.headerIcon} />
              <div className={s.count}></div>
            </DropdownToggle>
            <DropdownMenu right className={`${s.dropdownMenu} ${s.support}`}>
              <DropdownItem>
                <Badge color="danger">
                  <i className="fa fa-bell-o" />
                </Badge>
                <div className={s.details}>alert message#1</div>
              </DropdownItem>
              <DropdownItem>
                <Badge color="warning">
                  <i className="fa fa-question-circle" />
                </Badge>
                <div className={s.details}>alert message#2</div>
              </DropdownItem>
              <DropdownItem>
                <Badge color="success">
                  <i className="fa fa-info-circle" />
                </Badge>
                <div className={s.details}>alert message#3</div>
              </DropdownItem>
              <DropdownItem>
                <Badge color="info">
                  <i className="fa fa-plus" />
                </Badge>
                <div className={s.details}>alert message#4</div>
              </DropdownItem>
              <DropdownItem>
                <Badge color="danger">
                  <i className="fa fa-tag" />
                </Badge>
                <div className={s.details}>alert message#5</div>
              </DropdownItem>
              <DropdownItem>
                {/* eslint-disable-next-line */}
                <a href="#" className="text-white">
                  More <ArrowIcon className={s.headerIcon} maskName="bellArrow" />
                </a>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
