import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { PieChart, BarChart, Bar, Pie, Sector, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment/moment";

import s from "../Charts.module.scss";

import Widget from "../../../components/Widget";
import Toggle from "../../../components/Toggle/Toggle";
import CustomTooltip from "../component/CustomTooltip";
import renderActiveShape from "../component/PieChartShape";

import { getChartData } from "../../../utils/getChartDataWithZero";
import UserService from "../../../services/UserService";
import GroupService from "../../../services/GroupService";
import LogService from "../../../services/LogService";

export default function UserCharts() {
  const [isUserCreationDateView, setIsUserCreationDateView] = useState(true);
  const [isUserLoginDateView, setIsUserLoginDateView] = useState(true);
  const [isGroupCreationDateView, setIsGroupCreationDateView] = useState(true);

  const [userCreationActiveIndex, setUserCreationActiveIndex] = useState(0);
  const [userCreationTop5, setUserCreationTop5] = useState([]);

  const [userLoginActiveIndex, setUserLoginActiveIndex] = useState(0);
  const [userLoginTop5, setUserLoginTop5] = useState([]);

  const [userGroupActiveIndex, setUserGroupActiveIndex] = useState(0);
  const [userGroupTop5, setUserGroupTop5] = useState([]);

  const [userCreationStatistic, setUserCreationStatistic] = useState([]);
  const [userLoginStatistic, setUserLoginStatistic] = useState([]);
  const [groupCreationStatistic, setGroupCreationStatistic] = useState([]);

  useEffect(() => {
    getUserCreationChart({ category: "date" });
    getUserCreationTop5();
    getUserLoginTop5();
    getUserLoginChart({ category: "date" });
    getGroupCreationChart({ category: "date" });
    getUserGroupTop5();
  }, []);

  //----------------------------------------사용자 생성 수 (bar chart)
  // 사용자 생성 통계
  const getUserCreationChart = (params) => {
    UserService.getAllCreationByChart(params).then((res) => {
      const data = res.data;
      const result = getChartData(data, params);
      setUserCreationStatistic(result);
    });
  };

  // 사용자 생성 통계 toggle button click
  const handleUserCreationToggle = (e) => {
    const value = e.target.checked;
    setIsUserCreationDateView(value);
    if (value) {
      getUserCreationChart({ category: "date" });
    } else {
      getUserCreationChart({ category: "month" });
    }
  };

  //----------------------------------------사용자 생성 수 (pie chart)
  // 사용자 생성 수 top5 통계
  const getUserCreationTop5 = () => {
    UserService.getTop5Creation()
      .then((res) => {
        setUserCreationTop5(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 사용자 생성 수 pie chart에서 마우스 hover
  const onUserCreationPieEnter = (_, index) => {
    setUserCreationActiveIndex(index);
  };

  //----------------------------------------사용자 로그인 수 (pie chart)
  // 사용자 로그인 수 top5 통계
  const getUserLoginTop5 = () => {
    LogService.getTop5Login()
      .then((res) => {
        setUserLoginTop5(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 사용자 로그인 수 pie chart에서 마우스 hover
  const onUserLoginPieEnter = (_, index) => {
    setUserLoginActiveIndex(index);
  };

  //----------------------------------------사용자 로그인 수 (bar chart)

  // 사용자 로그인 통계
  const getUserLoginChart = (params) => {
    LogService.getAllLoginByChart(params).then((res) => {
      const data = res.data;
      const result = getChartData(data, params);
      setUserLoginStatistic(result);
    });
  };

  // 사용자 생성 통계 toggle button click
  const handleUserLoginToggle = (e) => {
    const value = e.target.checked;
    setIsUserLoginDateView(value);
    if (value) {
      getUserLoginChart({ category: "date" });
    } else {
      getUserLoginChart({ category: "month" });
    }
  };

  //----------------------------------------그룹 사용자 수 (pie chart)
  // 그룹 사용자 수 top5 통계
  const getUserGroupTop5 = () => {
    UserService.getTop5Group()
      .then((res) => {
        setUserGroupTop5(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 그룹 사용자 수 pie chart에서 마우스 hover
  const onUserGroupPieEnter = (_, index) => {
    setUserGroupActiveIndex(index);
  };

  //----------------------------------------그룹 생성 수 (bar chart)
  // 그룹 생성 통계
  const getGroupCreationChart = (params) => {
    GroupService.getAllCreationByChart(params).then((res) => {
      const data = res.data;
      const result = getChartData(data, params);
      setGroupCreationStatistic(result);
    });
  };

  // 그룹 생성 통계 toggle button click
  const handleGroupCreationToggle = (e) => {
    const value = e.target.checked;
    setIsGroupCreationDateView(value);
    if (value) {
      getGroupCreationChart({ category: "date" });
    } else {
      getGroupCreationChart({ category: "month" });
    }
  };

  return (
    <div className={s.root}>
      <h1 className="page-title">
        Visual - <span className="fw-semi-bold">Charts</span>
      </h1>
      <div>
        <Row>
          <Col lg={9} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">User Creation</span> Count
                  <div className={s.toggleLabel}>
                    <Toggle
                      checked={isUserCreationDateView}
                      text={isUserCreationDateView ? "daily" : "monthly"}
                      size="default"
                      disabled={false}
                      onChange={handleUserCreationToggle}
                      offstyle="btn-danger"
                      onstyle="btn-success"
                      onBackgroundColor="#243627"
                      offBackgroundColor="#122115"
                    />
                  </div>
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={userCreationStatistic}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -30,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "#60606e" }} content={<CustomTooltip />} />
                  <Bar dataKey="count" stackId="a" fill="#243627" />
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={3} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">User Creation</span> Top 5
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <PieChart height={340}>
                  <Pie
                    activeIndex={userCreationActiveIndex}
                    activeShape={renderActiveShape}
                    data={userCreationTop5}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#243627"
                    dataKey="count"
                    onMouseEnter={onUserCreationPieEnter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
        </Row>
        <Row>
          <Col lg={3} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">User Login</span> Top 5
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <PieChart height={340}>
                  <Pie
                    activeIndex={userLoginActiveIndex}
                    activeShape={renderActiveShape}
                    data={userLoginTop5}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#5c3d44"
                    dataKey="count"
                    onMouseEnter={onUserLoginPieEnter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={9} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">User Login</span> Count
                  <div className={s.toggleLabel}>
                    <Toggle
                      checked={isUserLoginDateView}
                      text={isUserLoginDateView ? "daily" : "monthly"}
                      size="default"
                      disabled={false}
                      onChange={handleUserLoginToggle}
                      offstyle="btn-danger"
                      onstyle="btn-success"
                      onBackgroundColor="#5c3d44"
                      offBackgroundColor="#47383b"
                    />
                  </div>
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={userLoginStatistic}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -30,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "#60606e" }} content={<CustomTooltip />} />
                  <Bar dataKey="count" stackId="a" fill="#5c3d44" />
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
        </Row>
        <Row>
          <Col lg={9} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">Group Creation</span> Count
                  <div className={s.toggleLabel}>
                    <Toggle
                      checked={isGroupCreationDateView}
                      text={isGroupCreationDateView ? "daily" : "monthly"}
                      size="default"
                      disabled={false}
                      onChange={handleGroupCreationToggle}
                      offstyle="btn-danger"
                      onstyle="btn-success"
                      onBackgroundColor="#735A37"
                      offBackgroundColor="#3d301e"
                    />
                  </div>
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={groupCreationStatistic}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -30,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "#60606e" }} content={<CustomTooltip />} />
                  <Bar dataKey="count" stackId="a" fill="#735A37" />
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={3} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">Group having lots of users</span> Top 5
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <PieChart height={340}>
                  <Pie
                    activeIndex={userGroupActiveIndex}
                    activeShape={renderActiveShape}
                    data={userGroupTop5}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#735A37"
                    dataKey="count"
                    onMouseEnter={onUserGroupPieEnter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
        </Row>
      </div>
    </div>
  );
}
