import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment/moment";

import s from "../Charts.module.scss";

import CustomTooltip from "../component/CustomTooltip";
import Widget from "../../../components/Widget";
import Toggle from "../../../components/Toggle/Toggle";

import { getDatesStartToLast, getMonthsStartToLast } from "../../../utils/getDateTerms";
import useInterval from "../../../utils/useInterval";
import MonitoringService from "../../../services/MonitoringService";
import LogService from "../../../services/LogService";

export default function SystemCharts() {
  const [cpuStatistic, setCpuStatistic] = useState([]);
  const [memoryStatistic, setMemoryStatistic] = useState([]);
  const [diskStatistic, setDiskStatistic] = useState([]);

  const [isBasicDateView, setIsBasicDateView] = useState(true);
  const [isSuccessDateView, setIsSuccessDateView] = useState(true);
  const [isErrorDateView, setIsErrorDateView] = useState(true);

  const [basicLogStatistic, setBasicLogStatistic] = useState([]);
  const [successLogStatistic, setSuccessLogStatistic] = useState([]);
  const [errorLogStatistic, setErrorLogStatistic] = useState([]);

  useEffect(() => {
    getCPUChart();
    getMemoryChart();
    getDiskChart();
    getLogChart({ category: "date", status: "BASIC" });
    getLogChart({ category: "date", status: "SUCCESS" });
    getLogChart({ category: "date", status: "ERROR" });
  }, []);

  useInterval(() => {
    getCPUChart();
    getMemoryChart();
    getDiskChart();
  }, 5000);

  // cpu 통계 5초마다 추가
  const getCPUChart = () => {
    MonitoringService.getCPUUsage()
      .then((res) => {
        const cpu = res.data;
        setCpuStatistic(cpuStatistic.concat({ name: moment().format("HH:mm:ss"), value: parseInt(cpu) }));
        if (cpuStatistic.length >= 20) {
          const removeFirstItem = cpuStatistic.splice(1);
          setCpuStatistic(removeFirstItem);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 메모리 통계 5초마다 추가
  const getMemoryChart = () => {
    MonitoringService.getMemoryUsage()
      .then((res) => {
        const mem = res.data;
        setMemoryStatistic(memoryStatistic.concat({ name: moment().format("HH:mm:ss"), value: parseInt(mem) }));
        if (memoryStatistic.length >= 20) {
          const removeFirstItem = memoryStatistic.splice(1);
          setMemoryStatistic(removeFirstItem);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 디스크 통계 5초마다 추가
  const getDiskChart = () => {
    MonitoringService.getDiskUsage()
      .then((res) => {
        const disk = res.data;
        setDiskStatistic(diskStatistic.concat({ name: moment().format("HH:mm:ss"), value: parseInt(disk) }));
        if (diskStatistic.length >= 20) {
          const removeFirstItem = diskStatistic.splice(1);
          setDiskStatistic(removeFirstItem);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 로그 통계
  const getLogChart = (params) => {
    LogService.getAllByChart(params).then((res) => {
      const data = res.data;
      let dailyList;
      const end = moment(new Date()).format("YYYY-MM-DD");

      if (params.category === "date") {
        // 일별 통계일 경우 한달치 제공
        const start = moment(new Date()).add("-1", "M").format("YYYY-MM-DD");
        dailyList = getDatesStartToLast(start, end);
      } else if (params.category === "month") {
        // 월별 통계일 경우 일년치 제공
        const start = moment(new Date()).add("-1", "Y").format("YYYY-MM-DD");
        dailyList = getMonthsStartToLast(start, end);
      }

      let result = [];
      let arrayIndex = 0;

      for (var i = 0; i < dailyList.length; i++) {
        if (data[arrayIndex] !== undefined && data[arrayIndex].name === dailyList[i]) {
          result.push({ name: data[arrayIndex].name, count: data[arrayIndex].count });
          arrayIndex++;
        } else {
          result.push({ name: dailyList[i], count: 0 });
        }
      }
      switch (params.status) {
        case "BASIC":
          setBasicLogStatistic(result);
          break;
        case "SUCCESS":
          setSuccessLogStatistic(result);
          break;
        case "ERROR":
          setErrorLogStatistic(result);
          break;
        default:
          break;
      }
    });
  };

  // toggle button click
  const handleBasicToggle = (e) => {
    const value = e.target.checked;
    setIsBasicDateView(value);
    if (value) {
      getLogChart({ category: "date", status: "BASIC" });
    } else {
      getLogChart({ category: "month", status: "BASIC" });
    }
  };
  const handleSuccessToggle = (e) => {
    const value = e.target.checked;
    setIsSuccessDateView(value);
    if (value) {
      getLogChart({ category: "date", status: "SUCCESS" });
    } else {
      getLogChart({ category: "month", status: "SUCCESS" });
    }
  };
  const handleErrorToggle = (e) => {
    const value = e.target.checked;
    setIsErrorDateView(value);
    if (value) {
      getLogChart({ category: "date", status: "ERROR" });
    } else {
      getLogChart({ category: "month", status: "ERROR" });
    }
  };

  return (
    <div className={s.root}>
      <h1 className="page-title">
        Visual - <span className="fw-semi-bold">Charts</span>
      </h1>
      <div>
        <Row>
          <Col lg={5} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">CPU</span> Real-time Usage
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart
                  height={340}
                  data={cpuStatistic}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -30,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" isAnimationActive={false} dataKey="value" stroke="#8884d8" fill="#8884d8" dot={true} />
                </AreaChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={7} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">BASIC Log</span> Count
                  <div className={s.toggleLabel}>
                    <Toggle
                      checked={isBasicDateView}
                      text={isBasicDateView ? "daily" : "monthly"}
                      size="default"
                      disabled={false}
                      onChange={handleBasicToggle}
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
                  data={basicLogStatistic}
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
        </Row>
        <Row>
          <Col lg={5} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">MEMORY</span> Real-time Usage
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart
                  height={340}
                  data={memoryStatistic}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -30,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" isAnimationActive={false} dataKey="value" stroke="#8884d8" fill="#8884d8" dot={true} />
                </AreaChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={7} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">SUCCESS Log</span> Count
                  <div className={s.toggleLabel}>
                    <Toggle
                      checked={isSuccessDateView}
                      text={isSuccessDateView ? "daily" : "monthly"}
                      size="default"
                      disabled={false}
                      onChange={handleSuccessToggle}
                      offstyle="btn-danger"
                      onstyle="btn-success"
                      onBackgroundColor="#7C728C"
                      offBackgroundColor="#3b2f4f"
                    />
                  </div>
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={successLogStatistic}
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
                  <Bar dataKey="count" stackId="a" fill="#7C728C" />
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
        </Row>
        <Row>
          <Col lg={5} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">DISK</span> Real-time Usage
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart
                  height={340}
                  data={diskStatistic}
                  margin={{
                    top: 0,
                    right: 0,
                    left: -30,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" isAnimationActive={false} dataKey="value" stroke="#8884d8" fill="#8884d8" dot={true} />
                </AreaChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
          <Col lg={7} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">ERROR Log</span> Count
                  <div className={s.toggleLabel}>
                    <Toggle
                      checked={isErrorDateView}
                      text={isErrorDateView ? "daily" : "monthly"}
                      size="default"
                      disabled={false}
                      onChange={handleErrorToggle}
                      offstyle="btn-danger"
                      onstyle="btn-success"
                      onBackgroundColor="#5B475C"
                      offBackgroundColor="#3e2540"
                    />
                  </div>
                </h6>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={errorLogStatistic}
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
                  <Bar dataKey="count" stackId="a" fill="#5B475C" />
                </BarChart>
              </ResponsiveContainer>
            </Widget>
          </Col>
        </Row>
      </div>
    </div>
  );
}
