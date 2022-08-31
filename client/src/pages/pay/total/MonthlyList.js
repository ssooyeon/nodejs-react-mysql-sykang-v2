import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment/moment";

import Widget from "../../../components/Widget";
import s from "./TotalList.module.scss";

import PayService from "../../../services/PayService";

export default function MonthlyList({ user, isListUpdated }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    PayService.getSixMonthlySpending({ userId: user.id })
      .then((res) => {
        if (res.data.length > 0) {
          const start = new Date(new Date().setMonth(new Date().getMonth() - 6));
          const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
          const sdt = moment(start).format("YYYY-MM-DD");
          const edt = moment(end).format("YYYY-MM-DD");
          const result = getData(res.data, sdt, edt);
          setData(result);
        }
      })
      .catch((e) => console.log(e));
  }, [user, isListUpdated]);

  // amount가 없는 달도 포함하여 결과 생성
  const getData = (data, start, end) => {
    const dailyList = getMonthsStartToLast(start, end);
    let result = [];
    let arrayIndex = 0;

    for (var i = 0; i < dailyList.length; i++) {
      if (data[arrayIndex] !== undefined && data[arrayIndex].date === dailyList[i]) {
        result.push({ date: data[arrayIndex].date, income: data[arrayIndex].income, spending: data[arrayIndex].spending });
        arrayIndex++;
      } else {
        result.push({ date: dailyList[i], income: 0, spending: 0 });
      }
    }
    return result;
  };

  // date range 구하기 (월)
  const getMonthsStartToLast = (startMonth, lastMonth) => {
    let result = [];
    let curDate = new Date(startMonth);
    while (curDate <= new Date(lastMonth)) {
      let yyymmdd = curDate.toISOString().split("T")[0];
      result.push(yyymmdd.slice(0, 7));
      curDate.setMonth(curDate.getMonth() + 1);
    }
    return result;
  };

  return (
    <>
      <Widget style={{ minHeight: "150px" }} title={<h6>Monthly</h6>}>
        <div className={s.overFlow}>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <ListGroup>
                {data &&
                  data.slice(0, Math.ceil(data.length / 2)).map((d, idx, row) => {
                    return (
                      <ListGroupItem className={s.listGroupItems} key={idx}>
                        <div className={s.date}>{d.date}</div>
                        <div className={s.income}>{d.income.toLocaleString()}</div>
                        <div className={s.spending}>{d.spending.toLocaleString()}</div>
                      </ListGroupItem>
                    );
                  })}
              </ListGroup>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <ListGroup>
                {data &&
                  data.slice(Math.ceil(data.length / 2)).map((d, idx, row) => {
                    return (
                      <ListGroupItem className={s.listGroupItems} key={idx}>
                        <div className={s.date}>{d.date}</div>
                        <div className={s.income}>{d.income.toLocaleString()}</div>
                        <div className={s.spending}>{d.spending.toLocaleString()}</div>
                      </ListGroupItem>
                    );
                  })}
              </ListGroup>
            </Col>
          </Row>
        </div>
      </Widget>
    </>
  );
}
