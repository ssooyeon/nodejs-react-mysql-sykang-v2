import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, ListGroupItem, Button } from "reactstrap";
import moment from "moment/moment";

import Widget from "../../../components/Widget";
import s from "./TotalList.module.scss";

import DailyPayModal from "../calendar/modal/DailyPayModal";

import PayService from "../../../services/PayService";
const today = new Date();
const sixMonthAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1); // 6달 전 1일
const lastDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); // 이번 달 마지막일

export default function MonthlyList({ user, someUpdate, isListUpdated }) {
  const [data, setData] = useState([]);
  const [isUpdateData, setIsUpdateData] = useState(0);

  const [dailyPayModalOpen, setDailyPayModalOpen] = useState(false);
  const [dailyPayDate, setDailyPayDate] = useState(new Date());

  useEffect(() => {
    const params = { userId: user.id, start: sixMonthAgo, end: lastDayOfCurrentMonth };
    getMonthlySpending(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isListUpdated]);

  const getMonthlySpending = (params) => {
    PayService.getSixMonthlySpending(params)
      .then((res) => {
        const sdt = moment(params.start).format("YYYY-MM-DD");
        const edt = moment(params.end).format("YYYY-MM-DD");
        const result = getData(res.data, sdt, edt);
        setData(result);
      })
      .catch((e) => console.log(e));
  };

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

  const handleLeftMonth = () => {
    if (isUpdateData === 1) {
      setIsUpdateData(0);
      const params = { userId: user.id, start: sixMonthAgo, end: lastDayOfCurrentMonth };
      getMonthlySpending(params);
    } else {
      setIsUpdateData(-1);
      let today = new Date();
      const eightMonthAgo = new Date(today.getFullYear(), today.getMonth() - 8, 1); // 8달 전 1일
      const lastDayOfThreeMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 0); // 3달 전 마지막일

      const params = { userId: user.id, start: eightMonthAgo, end: lastDayOfThreeMonthAgo };
      getMonthlySpending(params);
    }
  };

  const handleRightMonth = () => {
    if (isUpdateData === -1) {
      setIsUpdateData(0);
      const params = { userId: user.id, start: sixMonthAgo, end: lastDayOfCurrentMonth };
      getMonthlySpending(params);
    } else {
      setIsUpdateData(1);
      let today = new Date();
      const threeMonthAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1); // 2달 전 1일
      const lastDayOfAfterThreeMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 4, 0); // 3달 후 마지막일

      const params = { userId: user.id, start: threeMonthAgo, end: lastDayOfAfterThreeMonth };
      getMonthlySpending(params);
    }
  };

  // 달 클릭 시 해당 달의 list 모두 표출
  const handleMonthItemClick = (date) => {
    setDailyPayDate(date);
    setDailyPayModalOpen(true);
  };

  // DailyPayModal.js에서 닫기 버튼 클릭
  const handleDailyPayModalClick = (value) => {
    setDailyPayModalOpen(value);
  };

  return (
    <>
      <Widget
        style={{ minHeight: "150px" }}
        title={
          <h6>
            Monthly
            <div className="float-right">
              <Button
                color=""
                className={s.transparentButton}
                size="xs"
                onClick={handleLeftMonth}
                style={{ cursor: isUpdateData === -1 ? "not-allowed" : null }}
                disabled={isUpdateData === -1 ? true : false}
              >
                <i className="fa fa-caret-left"></i>
              </Button>
              <Button
                color=""
                className={s.transparentButton}
                size="xs"
                onClick={handleRightMonth}
                style={{ cursor: isUpdateData === 1 ? "not-allowed" : null }}
                disabled={isUpdateData === 1 ? true : false}
              >
                <i className="fa fa-caret-right"></i>
              </Button>
            </div>
          </h6>
        }
      >
        <div className={s.overFlow}>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <ListGroup>
                {data &&
                  data.slice(0, Math.ceil(data.length / 2)).map((d, idx, row) => {
                    return (
                      <ListGroupItem className={s.listGroupItems} key={idx} onClick={() => handleMonthItemClick(d.date)}>
                        <div
                          className={s.date}
                          style={{
                            color: d.date && moment(new Date()).format("YYYY-MM") === moment(d.date).format("YYYY-MM") ? "#fff" : null,
                          }}
                        >
                          {d.date}
                        </div>
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
                      <ListGroupItem className={s.listGroupItems} key={idx} onClick={() => handleMonthItemClick(d.date)}>
                        <div
                          className={s.date}
                          style={{
                            color: d.date && moment(new Date()).format("YYYY-MM") === moment(d.date).format("YYYY-MM") ? "#fff" : null,
                          }}
                        >
                          {d.date}
                        </div>
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

      <DailyPayModal
        open={dailyPayModalOpen}
        someUpdate={someUpdate}
        handleCloseClick={handleDailyPayModalClick}
        user={user}
        date={dailyPayDate}
        type="monthly"
      />
    </>
  );
}
