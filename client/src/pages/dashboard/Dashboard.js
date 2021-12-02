import React, { useEffect, useState } from "react";
import { Row, Col, Progress, Table, Label, Input } from "reactstrap";

import Widget from "../../components/Widget";

import Calendar from "./components/calendar/Calendar";

import AnimateNumber from "react-animated-number";

import s from "./Dashboard.module.scss";

export default function Dashboard() {
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
              </h5>
            }
            refresh
          >
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">CPU usage</p>
                <Progress color="primary" value="60" className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={75} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">Memory usage</p>
                <Progress color="danger" value="39" className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={84} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">Disk usage</p>
                <Progress color="success" value="80" className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={92} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <p>
              <span className="circle bg-default text-white">
                <i className="fa fa-cog" />
              </span>
              &nbsp; It is not updated in real time, and the data is updated through the refresh icon at the top right.
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
                <button className="list-group-item text-left">
                  <span className="thumb-sm float-left mr">
                    <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#b84a4a" }}>
                      <p style={{ margin: "7px" }}>U</p>
                    </span>
                    <i className="status status-bottom bg-success" />
                  </span>
                  <div>
                    <h6 className="m-0" style={{ color: "green" }}>
                      INFO
                    </h6>
                    <p className="help-block text-ellipsis m-0 float-left">User create successfully. New user account is: tt4</p>
                    <p className="help-block text-ellipsis float-right" style={{ margin: 0 }}>
                      2021-07-20 08:23:59
                    </p>
                  </div>
                </button>
                <button className="list-group-item text-left">
                  <span className="thumb-sm float-left mr">
                    <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "rgb(137 164 105)" }}>
                      <p style={{ margin: "7px" }}>G</p>
                    </span>
                    <i className="status status-bottom bg-success" />
                  </span>
                  <div>
                    <h6 className="m-0" style={{ color: "green" }}>
                      INFO
                    </h6>
                    <p className="help-block text-ellipsis m-0 float-left">Group delete successfully. Group id is: 39</p>
                    <p className="help-block text-ellipsis float-right" style={{ margin: 0 }}>
                      2021-07-21 02:12:59
                    </p>
                  </div>
                </button>
                <button className="list-group-item text-left">
                  <span className="thumb-sm float-left mr">
                    <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "rgb(152 84 62)" }}>
                      <p style={{ margin: "7px" }}>T</p>
                    </span>
                    <i className="status status-bottom bg-primary" />
                  </span>
                  <div>
                    <h6 className="m-0" style={{ color: "red" }}>
                      ERROR
                    </h6>
                    <p className="help-block text-ellipsis m-0 float-left">Task create failed. Task title is: heroku cleardb</p>
                    <p className="help-block text-ellipsis float-right" style={{ margin: 0 }}>
                      2021-09-20 17:22:23
                    </p>
                  </div>
                </button>
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
