import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import s from "./Pay.module.scss";

import PayList from "./pay/PayList";
import AmountText from "./panel/AmountText";
import CatChart from "./chart/CatChart";
import AssertList from "./assert/AssertList";
import CatList from "./cat/CatList";

export default function Pay() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isListUpdated, setIsListUpdated] = useState(0);

  const handleSomeUpdate = () => {
    setIsListUpdated(isListUpdated + 1);
  };

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Household ledger - <span className="fw-semi-bold">Payment</span>
      </h2>
      <Row>
        <Col lg={6} md={12} sm={12}>
          <PayList user={currentUser} someUpdate={handleSomeUpdate} isListUpdated={isListUpdated} />
        </Col>
        <Col lg={3} md={12} sm={12}>
          <AmountText user={currentUser} isListUpdated={isListUpdated} />
        </Col>
        <Col lg={3} md={12} sm={12}>
          <CatChart user={currentUser} isListUpdated={isListUpdated} />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12} sm={12}>
          Cal
        </Col>
        <Col lg={3} md={12} sm={12}>
          <AssertList user={currentUser} someUpdate={handleSomeUpdate} />
        </Col>
        <Col lg={3} md={12} sm={12}>
          <CatList user={currentUser} someUpdate={handleSomeUpdate} />
        </Col>
      </Row>
    </div>
  );
}
