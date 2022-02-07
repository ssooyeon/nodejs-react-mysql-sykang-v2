import React, { useEffect, useState } from "react";
import { Row, Col, Progress, Button } from "reactstrap";
import Moment from "react-moment";
import Widget from "../../components/Widget";
import Calendar from "./components/calendar/Calendar";
import AnimateNumber from "react-animated-number";
import s from "./Dashboard.module.scss";

import MonitoringService from "../../services/MonitoringService";
import LogService from "../../services/LogService";

export default function Dashboard() {
  const [cpuPercent, setCpuPercent] = useState(0);
  const [memoryPercent, setMemoryPercent] = useState(0);
  const [diskPercent, setDiskPercent] = useState(0);
  const [logList, setLogList] = useState([]);

  useEffect(() => {
    getSystemUsage();
    console.log(1);

    var listItem = [];
    listItem["basic"] = 70.9457;
    listItem["go"] = 27.56246;
    listItem["???hee"] = 1.32304;
    listItem["**young"] = 0.15877;
    listItem["!!!!!!jun"] = 0.01003;

    var pliromkey = [];
    pliromkey["fail"] = 99;
    pliromkey["success"] = 1;

    var synthetic = [];
    synthetic["fail"] = 86;
    synthetic["success"] = 14;

    for (var i = 0; i < 11; i++) {
      const result = plzGiveJun(listItem);
      if (result === "???hee" || result === "**young" || result === "!!!!!!jun") {
        console.log(result);
      }
    }

    // const pil = plzGiveJun(pliromkey);
    // console.log(pil);

    // const sy = plzGiveJun(synthetic);
    // console.log(sy);
  }, []);

  const getSystemUsage = () => {
    getCpuPercent();
    getMemoryPercent();
    getDiskPercent();
    getLogList();
  };

  const plzGiveJun = (listItem) => {
    var pickVal = Number.MAX_VALUE;
    var pickItem = null;
    for (var item in listItem) {
      if (listItem.hasOwnProperty(item)) {
        var tmpVal = -Math.log(Math.random()) / listItem[item];
        if (tmpVal < pickVal) {
          pickVal = tmpVal;
          pickItem = item;
        }
      }
    }
    return pickItem;
  };

  const getCpuPercent = () => {
    MonitoringService.getCPUUsage()
      .then((res) => {
        const cpu = res.data;
        setCpuPercent(parseInt(cpu));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getMemoryPercent = () => {
    MonitoringService.getMemoryUsage()
      .then((res) => {
        const mem = res.data;
        setMemoryPercent(parseInt(mem));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getDiskPercent = () => {
    MonitoringService.getDiskUsage()
      .then((res) => {
        const disk = res.data;
        setDiskPercent(parseInt(disk));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getLogList = () => {
    LogService.getAll()
      .then((res) => {
        setLogList(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const isSameDay = (date) => {
    const day = new Date(date).getDay();
    const today = new Date().getDay();
    return day === today;
  };

  return (
    <div className={s.root}>
      <h1 className="page-title">Dashboard &nbsp;</h1>

      <Row>
        <Col lg={7}>
          <Widget title={""} bodyClass={"pt-2 px-0 py-0"}>
            <Calendar />
            <div className="list-group fs-mini">
              <button className="list-group-item text-ellipsis">
                <span className="badge badge-pill badge-primary float-right">13:30</span>
                Today's to do #1
              </button>
              <button className="list-group-item text-ellipsis">
                <span className="badge badge-pill badge-success float-right">17:00</span>
                Today's to do #2
              </button>
            </div>
          </Widget>
        </Col>
        <Col lg={5}>
          <Widget
            className="bg-transparent"
            title={
              <h5>
                {" "}
                System
                <span className="fw-semi-bold">&nbsp;Usage</span>
                &nbsp;&nbsp;
                <Button color="inverse" className="social-button" size="xs" onClick={getSystemUsage}>
                  <i className="la la-refresh"></i>
                </Button>
              </h5>
            }
            refresh
          >
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">CPU usage</p>
                <Progress color="primary" value={cpuPercent} className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={cpuPercent} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">Memory usage</p>
                <Progress color="danger" value={memoryPercent} className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={memoryPercent} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">Disk usage</p>
                <Progress color="success" value={diskPercent} className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={diskPercent} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <p>
              <span className="circle bg-default text-white">
                <i className="fa fa-cog" />
              </span>
              &nbsp; It is not updated in real time, and the data is updated through the refresh icon at the top.
            </p>
          </Widget>
        </Col>
      </Row>

      <Row>
        <Col lg={6} xl={4} xs={12}>
          <Widget title={<h6> Weather </h6>}>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Temperature</h6>
                <p className="value">9&deg; / A lot of clouds</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Date</h6>
                <p className="value">2021-11-29 11:47</p>
              </div>
            </div>
            <Progress color="danger" value="60" className="bg-subtle-blue progress-xs" />
            <p>
              <small>
                <span className="circle bg-default text-white mr-2">
                  <i className="fa fa-chevron-down" />
                </span>
              </small>
              <span className="fw-semi-bold">1&deg; lower</span>
              &nbsp;than yesterday
            </p>
          </Widget>
        </Col>
        <Col lg={6} xl={4} xs={12}>
          <Widget title={<h6> Weather </h6>}>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Probability of precipitation</h6>
                <p className="value">30%</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Humidity</h6>
                <p className="value">58%</p>
              </div>
              <div className="stat-item">
                <h6 className="name">wind</h6>
                <p className="value">0m/h</p>
              </div>
            </div>
            <Progress color="success" value="60" className="bg-subtle-blue progress-xs" />
            <p>
              <small>
                <span className="circle bg-default text-white mr-2">
                  <i className="fa fa-chevron-up" />
                </span>
              </small>
              humidity<span className="fw-semi-bold">&nbsp;17% higher</span>
              &nbsp;than yesterday
            </p>
          </Widget>
        </Col>
        <Col lg={6} xl={4} xs={12}>
          <Widget title={<h6> Etc </h6>}>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name fs-sm">temp#1</h6>
                <p className="value">value#1</p>
              </div>
              <div className="stat-item">
                <h6 className="name fs-sm">temp#2</h6>
                <p className="value">value#2</p>
              </div>
              <div className="stat-item">
                <h6 className="name fs-sm">temp#2</h6>
                <p className="value">value#3</p>
              </div>
            </div>
            <Progress color="bg-primary" value="60" className="bg-subtle-blue progress-xs" />
            <p>
              <small>
                <span className="circle bg-default text-white mr-2">
                  <i className="fa fa-plus" />
                </span>
              </small>
              <span className="fw-semi-bold">41 higher</span>
              &nbsp;than yesterday
            </p>
          </Widget>
        </Col>
      </Row>

      <Row>
        <Col lg={12} xs={12}>
          <Widget title={<h6> Logs</h6>} refresh>
            <div className="widget-body undo_padding">
              <div className="list-group list-group-lg">
                {logList.map((log) => {
                  return (
                    <button className="list-group-item text-left" key={log.id} style={{ padding: "0.75rem" }}>
                      <span className="thumb-sm float-left mr">
                        {log.status === "BASIC" ? (
                          <>
                            <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#374c37" }}>
                              <p style={{ margin: "7px" }}>B</p>
                            </span>
                            <i className="status status-bottom bg-success" />
                          </>
                        ) : log.status === "SUCCESS" ? (
                          <>
                            <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#3e5984" }}>
                              <p style={{ margin: "7px" }}>S</p>
                            </span>
                            <i className="status status-bottom bg-primary" />
                          </>
                        ) : (
                          <>
                            <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#b84a4a" }}>
                              <p style={{ margin: "7px" }}>E</p>
                            </span>
                            <i className="status status-bottom bg-danger" />
                          </>
                        )}
                      </span>
                      <div>
                        {log.status === "BASIC" ? (
                          <h6 className="m-0" style={{ color: "green" }}>
                            {log.status}
                          </h6>
                        ) : log.status === "SUCCESS" ? (
                          <h6 className="m-0" style={{ color: "#2477ff" }}>
                            {log.status}
                          </h6>
                        ) : (
                          <h6 className="m-0" style={{ color: "red" }}>
                            {log.status}
                          </h6>
                        )}
                        <p className="help-block text-ellipsis m-0 float-left">{log.message}</p>
                        <p className="help-block text-ellipsis float-right" style={{ margin: 0 }}>
                          {isSameDay(log.createdAt) ? (
                            <span style={{ fontStyle: "italic" }}>Just Today &nbsp;</span>
                          ) : (
                            <Moment format="YYYY-MM-DD HH:mm:ss">{log.createdAt}</Moment>
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <footer className="bg-widget-transparent mt">
              <input type="search" className="form-control form-control-sm bg-custom-dark border-0" placeholder="Search" />
            </footer>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
