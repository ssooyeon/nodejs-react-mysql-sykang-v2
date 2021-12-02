import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "reactstrap";

import Widget from "../../components/Widget";
import s from "./Board.module.scss";

export default function Board() {
  return (
    <div className={s.root}>
      <h2 className="page-title">
        Tables - <span className="fw-semi-bold">Board</span>
      </h2>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Board</span>
              <div className="float-right">
                <Button color="default" className="mr-2" size="sm">
                  Add
                </Button>
              </div>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>posts</code> in the system.
            </p>
            <div className={s.overFlow}>
              <br />
              <Col lg={3} md={12} sm={12}>
                <Widget>
                  <h3>
                    <span className="fw-semi-bold">React widgets</span>
                  </h3>
                  <p>
                    React widgets, uses a "monorepo" organization style for managing multiple npm packages in a single git repo. This is done through
                    a Yarn feature called workspaces. To get everything setup and dependenc...
                  </p>
                  <p style={{ fontSize: "12px" }}>sykang / 2021-11-29 11:12:12</p>
                </Widget>
              </Col>
              <Col lg={3} md={12} sm={12}>
                <Widget>
                  <h3>
                    <span className="fw-semi-bold">React widgets</span>
                  </h3>
                  <p>
                    React widgets, uses a "monorepo" organization style for managing multiple npm packages in a single git repo. This is done through
                    a Yarn feature called workspaces. To get everything setup and dependenc...
                  </p>
                  <p style={{ fontSize: "12px" }}>sykang / 2021-11-29 11:12:12</p>
                </Widget>
              </Col>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
