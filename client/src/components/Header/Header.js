import { connect } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
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

import { logoutUser } from "../../actions/user";
import { openSidebar, closeSidebar, changeSidebarPosition, changeSidebarVisibility } from "../../actions/navigation";

import s from "./Header.module.scss";
import "animate.css";

class Header extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebarPosition: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this);
    this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this);
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this);
    this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearchOpen = this.toggleSearchOpen.bind(this);

    this.state = {
      visible: true,
      messagesOpen: false,
      supportOpen: false,
      settingsOpen: false,
      searchFocused: false,
      searchOpen: false,
      notificationsOpen: false,
    };
  }

  toggleNotifications = () => {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  };

  onDismiss() {
    this.setState({ visible: false });
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  toggleMessagesDropdown() {
    this.setState({
      messagesOpen: !this.state.messagesOpen,
    });
  }

  toggleSupportDropdown() {
    this.setState({
      supportOpen: !this.state.supportOpen,
    });
  }

  toggleSettingsDropdown() {
    this.setState({
      settingsOpen: !this.state.settingsOpen,
    });
  }

  toggleAccountDropdown() {
    this.setState({
      accountOpen: !this.state.accountOpen,
    });
  }

  toggleSearchOpen() {
    this.setState({
      searchOpen: !this.state.searchOpen,
    });
  }

  toggleSidebar() {
    this.props.isSidebarOpened ? this.props.dispatch(closeSidebar()) : this.props.dispatch(openSidebar());
  }

  moveSidebar(position) {
    this.props.dispatch(changeSidebarPosition(position));
  }

  toggleVisibilitySidebar(visibility) {
    this.props.dispatch(changeSidebarVisibility(visibility));
  }

  render() {
    return (
      <Navbar className={`d-print-none `}>
        <div className={s.burger}>
          <NavLink onClick={this.toggleSidebar} className={`d-md-none ${s.navItem} text-white`} href="#">
            <BurgerIcon className={s.headerIcon} />
          </NavLink>
        </div>
        <div className={`d-print-none ${s.root}`}>
          <Collapse className={`${s.searchCollapse} ml-lg-0 mr-md-3`} isOpen={this.state.searchOpen}>
            <InputGroup className={`${s.navbarForm} ${this.state.searchFocused ? s.navbarFormFocused : ""}`}>
              <InputGroupAddon addonType="prepend" className={s.inputAddon}>
                <InputGroupText>
                  <i className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="search-input-2"
                placeholder="Search..."
                className="input-transparent"
                onFocus={() => this.setState({ searchFocused: true })}
                onBlur={() => this.setState({ searchFocused: false })}
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
            <Dropdown
              nav
              isOpen={this.state.notificationsOpen}
              toggle={this.toggleNotifications}
              id="basic-nav-dropdown"
              className={`${s.notificationsMenu}`}
            >
              <DropdownToggle nav caret style={{ color: "#C1C3CF", padding: 0 }}>
                <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#5c4c4c" }}>
                  <p style={{ marginTop: "1rem" }}>S</p>
                </span>
                <span className={`small d-sm-down-none ${s.accountCheck}`}>sykang</span>
              </DropdownToggle>
            </Dropdown>
            <NavItem className={`${s.divider} d-none d-sm-block`} />
            <Dropdown className="d-none d-sm-block" nav isOpen={this.state.supportOpen} toggle={this.toggleSupportDropdown}>
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
              <NavLink className={`${s.navItem} text-white`} href="#/login">
                <PowerIcon className={s.headerIcon} />
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    isSidebarOpened: store.navigation.sidebarOpened,
    sidebarVisibility: store.navigation.sidebarVisibility,
    sidebarPosition: store.navigation.sidebarPosition,
  };
}

export default withRouter(connect(mapStateToProps)(Header));
