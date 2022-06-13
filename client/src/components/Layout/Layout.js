import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Hammer from "rc-hammerjs";

import UserGroupTable from "../../pages/usergroup/UserGroup";
import Board from "../../pages/board/Board";
import AddBoard from "../../pages/board/AddBoard";
import BoardDetail from "../../pages/board/BoardDetail";
import EditBoard from "../../pages/board/EditBoard";
import Profile from "../../pages/profile/Profile";
import Schedule from "../../pages/schedule/Schedule";
import Task from "../../pages/task/Task";
import SystemCharts from "../../pages/monitoring/system/SystemCharts";
import UserCharts from "../../pages/monitoring/user/UserCharts";
import TaskCharts from "../../pages/monitoring/task/TaskCharts";
import Dashboard from "../../pages/dashboard";
import Formatter from "../../pages/formatter/Formatter";
import ColorPicker from "../../pages/colorpicker/ColorPicker";
import Inbox from "../../pages/inbox/Inbox";

import Header from "../Header";
import Sidebar from "../Sidebar";
import BreadcrumbHistory from "../BreadcrumbHistory";
import { openSidebar, closeSidebar } from "../../actions/navigation";
import s from "./Layout.module.scss";

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
  };
  constructor(props) {
    super(props);

    this.handleSwipe = this.handleSwipe.bind(this);
  }

  handleSwipe(e) {
    if ("ontouchstart" in window) {
      if (e.direction === 4 && !this.state.chatOpen) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }

      this.setState({ chatOpen: e.direction === 2 });
    }
  }

  render() {
    return (
      <div className={[s.root, "sidebar-" + this.props.sidebarPosition, "sidebar-" + this.props.sidebarVisibility].join(" ")}>
        <div className={s.wrap}>
          <Header />
          {/* <Chat chatOpen={this.state.chatOpen} /> */}
          {/* <Helper /> */}
          <Sidebar />
          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
              <BreadcrumbHistory url={this.props.location.pathname} />
              <TransitionGroup>
                <CSSTransition key={this.props.location.key} classNames="fade" timeout={200}>
                  <Switch>
                    <Route path="/app/main" exact render={() => <Redirect to="/app/main/dashboard" />} />
                    <Route path="/app/main/dashboard" exact component={Dashboard} />
                    <Route path="/app/monitoring/system" exact component={SystemCharts} />
                    <Route path="/app/monitoring/user" exact component={UserCharts} />
                    <Route path="/app/monitoring/task" exact component={TaskCharts} />
                    <Route path="/app/tables" exact component={UserGroupTable} />
                    <Route path="/app/board" exact component={Board} />
                    <Route path="/app/board/add" exact component={AddBoard} />
                    <Route path="/app/board/detail/:id" exact component={BoardDetail} />
                    <Route path="/app/board/edit/:id" exact component={EditBoard} />
                    <Route path="/app/profile" exact component={Profile} />
                    <Route path="/app/schedule" exact component={Schedule} />
                    <Route path="/app/task" exact component={Task} />
                    <Route path="/app/formatter" exact component={Formatter} />
                    <Route path="/app/colorpicker" exact component={ColorPicker} />
                    <Route path="/app/inbox" exact component={Inbox} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
              <footer className={s.contentFooter}>
                React project made by <a href="/">sykang</a>, refer: <a href="https://flatlogic.com">Flatlogic</a>
              </footer>
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarPosition: store.navigation.sidebarPosition,
    sidebarVisibility: store.navigation.sidebarVisibility,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
