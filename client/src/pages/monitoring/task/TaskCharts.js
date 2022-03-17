import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { PieChart, BarChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import s from "../Charts.module.scss";

import Widget from "../../../components/Widget";
import Toggle from "../../../components/Toggle/Toggle";
import CustomTooltip from "../component/CustomTooltip";
import renderActiveShape from "../component/PieChartShape";

import { getChartData } from "../../../utils/getChartDataWithZero";
import TaskService from "../../../services/TaskService";

export default function TaskCharts() {
  const [isTaskDueDateView, setIsTaskDueDateView] = useState(true);

  const [taskDueDateActiveIndex, setTaskDueDateActiveIndex] = useState(0);
  const [taskDueDateTop5, setTaskDueDateTop5] = useState([]);

  const [taskUserActiveIndex, setTaskUserActiveIndex] = useState(0);
  const [taskUserTop5, setTaskUserTop5] = useState([]);

  const [taskDueDateStatistic, setTaskDueDateStatistic] = useState([]);
  const [taskFolderStatistic, setTaskFolderStatistic] = useState([]);
  const [taskUserFolderStatistic, setTaskUserFolderStatistic] = useState([]);

  const [taskUserFolderColumn, setTaskUserFolderColumn] = useState([]);

  useEffect(() => {
    getTaskDueDateChart({ category: "date" });
    getTaskDueDateTop5();
    getTaskFolderChart();
    getTaskUserFolderChart();
    getTaskUserTop5();
  }, []);

  //----------------------------------------테스크 만료일 수 (bar chart)
  // 테스크 duedate 통계
  const getTaskDueDateChart = (params) => {
    TaskService.getAllDueDateByChart(params).then((res) => {
      const data = res.data;
      const result = getChartData(data, params);
      setTaskDueDateStatistic(result);
    });
  };

  // 테스크 duedate 통계 toggle button click
  const handleTaskDueDateToggle = (e) => {
    const value = e.target.checked;
    setIsTaskDueDateView(value);
    if (value) {
      getTaskDueDateChart({ category: "date" });
    } else {
      getTaskDueDateChart({ category: "month" });
    }
  };

  //----------------------------------------테스크 만료일 수 (pie chart)
  // 테스크 duedate 수 top5 통계
  const getTaskDueDateTop5 = () => {
    TaskService.getTop5DueDate()
      .then((res) => {
        setTaskDueDateTop5(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 테스크 duedate 수 pie chart에서 마우스 hover
  const onTaskDueDatePieEnter = (_, index) => {
    setTaskDueDateActiveIndex(index);
  };

  //----------------------------------------폴더 별 테스크 수 (bar chart)
  // 폴더별 테스크 수 통계
  const getTaskFolderChart = () => {
    TaskService.getAllFolderByChart().then((res) => {
      const data = res.data;
      setTaskFolderStatistic(data);
    });
  };

  // 폴더별 테스크 수 차트 custom tooltip
  const NameTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ fontSize: "13px" }}>
          <p className="label">
            folder: {label} <br />
            value: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  //----------------------------------------폴더 별, 사용자 별 테스크 수 (bar chart)
  // 폴더별 테스크 수 통계
  const getTaskUserFolderChart = () => {
    TaskService.getAllUserFolderByChart().then((res) => {
      const data = res.data;

      let result = [];
      const folderNames = data.map((x) => x.name);
      const distinctFolderNames = [...new Set(folderNames)];
      setTaskUserFolderColumn(distinctFolderNames);

      data.map((d) => {
        let item = {};
        const account = d.creater.account;
        item.creater = account;
        distinctFolderNames.map((folder) => {
          if (folder === d.name) {
            const existIndex = result.findIndex((x) => x.creater === account);
            if (existIndex > -1) {
              result[existIndex][folder] = d.count;
            } else {
              item[folder] = d.count;
              result.push(item);
            }
          }
        });
      });
      setTaskUserFolderStatistic(result);
    });
  };

  // 사용자별 테스크 수 차트 custom tooltip
  const UserTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ fontSize: "13px" }}>
          <p className="label">
            user: {label} <br />
            {payload &&
              payload.map((val) => {
                return (
                  <span key={val.name}>
                    {val.name} : {val.value} <br />
                  </span>
                );
              })}
          </p>
        </div>
      );
    }
    return null;
  };

  //----------------------------------------테스크 많이 생성한 사용자 수 (pie chart)
  // 테스크 사용자 수 top5 통계
  const getTaskUserTop5 = () => {
    TaskService.getTop5TaskUser()
      .then((res) => {
        setTaskUserTop5(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 테스크 duedate 수 pie chart에서 마우스 hover
  const onTaskUserPieEnter = (_, index) => {
    setTaskUserActiveIndex(index);
  };

  return (
    <div className={s.root}>
      <h1 className="page-title">
        Visual - <span className="fw-semi-bold">Charts</span>
      </h1>
      <div>
        <Row>
          <Col lg={3} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">Task Due Date</span> Top 5
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <PieChart height={340}>
                  <Pie
                    activeIndex={taskDueDateActiveIndex}
                    activeShape={renderActiveShape}
                    data={taskDueDateTop5}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#4f2e31"
                    dataKey="count"
                    onMouseEnter={onTaskDueDatePieEnter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={9} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">Task Due Date</span> Count
                  <div className={s.toggleLabel}>
                    <Toggle
                      checked={isTaskDueDateView}
                      text={isTaskDueDateView ? "daily" : "monthly"}
                      size="default"
                      disabled={false}
                      onChange={handleTaskDueDateToggle}
                      offstyle="btn-danger"
                      onstyle="btn-success"
                      onBackgroundColor="#4f2e31"
                      offBackgroundColor="#543e40"
                    />
                  </div>
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={taskDueDateStatistic}
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
                  <Bar dataKey="count" stackId="a" fill="#4f2e31" />
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
        </Row>
        <Row>
          <Col lg={4} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">Task</span> Count by Folder
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={taskFolderStatistic}
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
                  <Tooltip cursor={{ fill: "#60606e" }} content={<NameTooltip />} />
                  <Bar dataKey="count" stackId="a" fill="#443554" />
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={5} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">Task with Folder</span> Count by User
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={taskUserFolderStatistic}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -30,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="creater" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "#60606e" }} content={<UserTooltip />} />
                  {taskUserFolderColumn &&
                    taskUserFolderColumn.map((col, index) => {
                      return <Bar key={index} dataKey={col} stackId={col} fill="#335247" />;
                    })}
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={3} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">Task User</span> Top 5
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart height={300}>
                  <Pie
                    activeIndex={taskUserActiveIndex}
                    activeShape={renderActiveShape}
                    data={taskUserTop5}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#595c3c"
                    dataKey="count"
                    onMouseEnter={onTaskUserPieEnter}
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
