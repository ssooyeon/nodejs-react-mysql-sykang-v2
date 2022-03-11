import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import s from "../Charts.module.scss";

import Widget from "../../../components/Widget";

import LogService from "../../../services/LogService";

export default function SystemCharts() {
  useEffect(() => {
    const params = { category: "month", status: "ERROR" };
    LogService.getAllByChart(params).then((res) => {
      const data = res.data;
      console.log(data);

      let seriesData = [];
      let cateogriesData = [];
      data.map((d) => {
        seriesData.push(d["count"]);
        cateogriesData.push(d["createdAt"]);
      });
    });
  }, []);

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
              dataType="cpu-chart"
              refreshFun={() => {}}
              refresh
            ></Widget>
          </Col>
          <Col lg={7} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">BASIC Log</span> Count
                </h6>
              }
              dataType="basic-log-chart"
              refreshFun={() => {}}
              refresh
            ></Widget>
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
              dataType="memory-chart"
              refreshFun={() => {}}
              refresh
            ></Widget>
          </Col>
          <Col lg={7} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">SUCCESS Log</span> Count
                </h6>
              }
              dataType="success-log-chart"
              refreshFun={() => {}}
              refresh
            ></Widget>
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
              dataType="disk-chart"
              refreshFun={() => {}}
              refresh
            ></Widget>
          </Col>
          <Col lg={7} xs={12}>
            <Widget
              title={
                <h6>
                  <span className="fw-semi-bold">ERROR Log</span> Count
                </h6>
              }
              dataType="error-log-chart"
              refreshFun={() => {}}
              refresh
            ></Widget>
          </Col>
        </Row>
      </div>
    </div>
  );
}
