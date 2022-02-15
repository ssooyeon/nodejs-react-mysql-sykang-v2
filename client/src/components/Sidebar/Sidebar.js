import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Progress, Alert } from "reactstrap";
import { withRouter } from "react-router-dom";
import { dismissAlert } from "../../actions/alerts";
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup";

import { changeActiveSidebarItem } from "../../actions/navigation";
import { logoutUser } from "../../actions/user";
import HomeIcon from "../Icons/SidebarIcons/HomeIcon";
import TypographyIcon from "../Icons/SidebarIcons/TypographyIcon";
import TablesIcon from "../Icons/SidebarIcons/TablesIcon";
import NotificationsIcon from "../Icons/SidebarIcons/NotificationsIcon";
import ComponentsIcon from "../Icons/SidebarIcons/ComponentsIcon";

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    activeItem: "",
  };

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  componentDidMount() {
    this.element.addEventListener(
      "transitionend",
      () => {
        if (this.props.sidebarOpened) {
          this.element.classList.add(s.sidebarOpen);
        }
      },
      false
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
      if (nextProps.sidebarOpened) {
        this.element.style.height = `${this.element.scrollHeight}px`;
      } else {
        this.element.classList.remove(s.sidebarOpen);
        setTimeout(() => {
          this.element.style.height = "";
        }, 0);
      }
    }
  }

  dismissAlert(id) {
    this.props.dispatch(dismissAlert(id));
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  render() {
    return (
      <nav
        className={cx(s.root)}
        ref={(nav) => {
          this.element = nav;
        }}
      >
        <header className={s.logo}>
          <a href="/">
            🌚 <span className="fw-bold"></span>
          </a>
        </header>
        <ul className={s.nav}>
          <LinksGroup
            onActiveSidebarItemChange={(activeItem) => this.props.dispatch(changeActiveSidebarItem(activeItem))}
            activeItem={this.props.activeItem}
            header="Dashboard"
            isHeader
            iconName={<HomeIcon className={s.menuIcon} />}
            link="/app/main"
            index="main"
          />
          <LinksGroup
            onActiveSidebarItemChange={(t) => this.props.dispatch(changeActiveSidebarItem(t))}
            activeItem={this.props.activeItem}
            header="Users & Groups"
            isHeader
            iconName={<TypographyIcon className={s.menuIcon} />}
            link="/app/tables"
            index="tables"
          />
          <LinksGroup
            onActiveSidebarItemChange={(t) => this.props.dispatch(changeActiveSidebarItem(t))}
            activeItem={this.props.activeItem}
            header="Board"
            isHeader
            iconName={<TablesIcon className={s.menuIcon} />}
            link="/app/board"
            index="board"
          />
          <LinksGroup
            onActiveSidebarItemChange={(activeItem) => this.props.dispatch(changeActiveSidebarItem(activeItem))}
            activeItem={this.props.activeItem}
            header="Monitoring"
            isHeader
            iconName={<ComponentsIcon className={s.menuIcon} />}
            link="/app/monitoring"
            index="monitoring"
            childrenLinks={[
              {
                header: "Charts",
                link: "/app/monitoring/charts",
              },
            ]}
          />
          {this.props.currentUser ? (
            <>
              <LinksGroup
                onActiveSidebarItemChange={(t) => this.props.dispatch(changeActiveSidebarItem(t))}
                activeItem={this.props.activeItem}
                header="Profile"
                isHeader
                iconName={<NotificationsIcon className={s.menuIcon} />}
                link="/app/profile"
                index="profile"
              />
              <LinksGroup
                onActiveSidebarItemChange={(t) => this.props.dispatch(changeActiveSidebarItem(t))}
                activeItem={this.props.activeItem}
                header="Schedule"
                isHeader
                iconName={<NotificationsIcon className={s.menuIcon} />}
                link="/app/schedule"
                index="Schedule"
              />
            </>
          ) : null}
        </ul>
        <h5 className={s.navTitle}>
          BOOKMARK
          {/* eslint-disable-next-line */}
        </h5>
        {/* eslint-disable */}
        <ul className={s.sidebarLabels}>
          <li>
            <a href="#">
              <i className="fa fa-circle text-success mr-2" />
              <span className={s.labelName}>Link#1</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-circle text-primary mr-2" />
              <span className={s.labelName}>Link#2</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-circle text-danger mr-2" />
              <span className={s.labelName}>Link#3</span>
            </a>
          </li>
        </ul>
        {/* eslint-enable */}
        <h5 className={s.navTitle}>ALRETS</h5>
        <div className={s.sidebarAlerts}>
          {this.props.alertsList.map(
            (
              alert // eslint-disable-line
            ) => (
              <Alert
                key={alert.id}
                className={s.sidebarAlert}
                color="transparent"
                isOpen={true} // eslint-disable-line
                toggle={() => {
                  this.dismissAlert(alert.id);
                }}
              >
                <span>{alert.title}</span>
                <br />
                <Progress className={`bg-subtle-blue progress-xs mt-1`} color={alert.color} value={alert.value} />
                <span className={s.alertFooter}>{alert.footer}</span>
              </Alert>
            )
          )}
        </div>
      </nav>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    alertsList: store.alerts.alertsList,
    activeItem: store.navigation.activeItem,
    currentUser: store.auth.user,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
