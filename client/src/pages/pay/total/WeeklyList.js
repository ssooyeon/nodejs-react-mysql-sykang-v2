import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment/moment";

import Widget from "../../../components/Widget";
import s from "./TotalList.module.scss";

import PayService from "../../../services/PayService";

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

export default function WeeklyList({ user, isListUpdated }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    PayService.getSixWeeklySpending({ userId: user.id })
      .then((res) => {
        if (res.data.length > 0) {
          // get monday of the 5 week ago
          const weeksAgo = new Date(new Date().setDate(new Date().getDate() - 7 * 5));
          const mon = weeksAgo.getDate() - weeksAgo.getDay() + 1;
          const start = new Date(weeksAgo.setDate(mon));

          // get sunday of the current week
          const first = new Date().getDate() - new Date().getDay() + 1;
          const sun = first + 6;
          const end = new Date(new Date().setDate(sun));

          const sdt = moment(start).format("YYYY-MM-DD");
          const edt = moment(end).format("YYYY-MM-DD");
          const result = getData(res.data, sdt, edt);
          setData(result);
        }
      })
      .catch((e) => console.log(e));
  }, [user, isListUpdated]);

  // amount가 없는 주도 포함하여 결과 생성
  const getData = (data, start, end) => {
    const dailyList = getWeeksStartToLast(start, end);
    let result = [];
    let arrayIndex = 0;

    for (var i = 0; i < dailyList.length; i++) {
      if (data[arrayIndex] !== undefined && data[arrayIndex].week === dailyList[i]) {
        result.push({ week: data[arrayIndex].week, income: data[arrayIndex].income, spending: data[arrayIndex].spending });
        arrayIndex++;
      } else {
        result.push({ week: dailyList[i], income: 0, spending: 0 });
      }
    }
    return result;
  };

  // date range 구하기 (주)
  const getWeeksStartToLast = (startWeek, lastWeek) => {
    let result = [];

    var start = moment(startWeek).startOf("week").toDate();
    var end = moment(lastWeek).endOf("week").toDate();

    let curDate = new Date(start);
    while (curDate <= new Date(end)) {
      const startOfWeek = moment(curDate).format("YYYY-MM-DD");
      var endOfWeek = moment(curDate).add(6, "days").format("YYYY-MM-DD");

      result.push(startOfWeek + " ~ " + endOfWeek);
      curDate.setDate(curDate.getDate() + 7);
    }
    return result;
  };

  return (
    <>
      <Widget style={{ minHeight: "150px" }} title={<h6>Weekly</h6>}>
        <div className={s.overFlow}>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <ListGroup>
                {data &&
                  data.slice(0, Math.ceil(data.length / 2)).map((d, idx, row) => {
                    return (
                      <ListGroupItem className={s.listGroupItems} key={idx}>
                        <div className={s.date}>{d.week}</div>
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
                        <div className={s.date}>{d.week}</div>
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
