import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, ListGroupItem, Button } from "reactstrap";
import moment from "moment/moment";

import Widget from "../../../components/Widget";
import s from "./TotalList.module.scss";

import DailyPayModal from "../calendar/modal/DailyPayModal";

import PayService from "../../../services/PayService";

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

const sixWeeksAgo = () => {
  // get monday of the 5 week ago, 5주 전 월요일
  const weeksAgo = new Date(new Date().setDate(new Date().getDate() - 7 * 5));
  const mon = weeksAgo.getDate() - weeksAgo.getDay() + 1;
  const start = new Date(weeksAgo.setDate(mon));
  return start;
};
const lastDayOfCurrentWeek = () => {
  // get sunday of the current week, 이번주 일요일
  const first = new Date().getDate() - new Date().getDay() + 1;
  const sun = first + 6;
  const end = new Date(new Date().setDate(sun));
  return end;
};

export default function WeeklyList({ user, someUpdate, isListUpdated }) {
  const [data, setData] = useState([]);
  const [sdt, setSdt] = useState(sixWeeksAgo);
  const [edt, setEdt] = useState(lastDayOfCurrentWeek);
  const [isUpdateData, setIsUpdateData] = useState(0);

  const [dailyPayModalOpen, setDailyPayModalOpen] = useState(false);
  const [dailyPayDate, setDailyPayDate] = useState(new Date());

  useEffect(() => {
    const params = { userId: user.id, start: sdt, end: edt };
    getWeeklySpending(params);
  }, [user, isListUpdated]);

  const getWeeklySpending = (params) => {
    PayService.getSixWeeklySpending(params)
      .then((res) => {
        const sdt = moment(params.start).format("YYYY-MM-DD");
        const edt = moment(params.end).format("YYYY-MM-DD");
        const result = getData(res.data, sdt, edt);
        setData(result);
      })
      .catch((e) => console.log(e));
  };

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

  const handleLeftWeek = () => {
    if (isUpdateData === 1) {
      setIsUpdateData(0);
      const params = { userId: user.id, start: sdt, end: edt };
      getWeeklySpending(params);
    } else {
      setIsUpdateData(-1);
      // get monday of the 8 week ago, 8주 전 월요일
      const eightWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 7 * 8));
      const mon = eightWeeksAgo.getDate() - eightWeeksAgo.getDay() + 1;
      const start = new Date(eightWeeksAgo.setDate(mon));

      // get sunday of the current week, 3주 전 일요일
      const threeWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 7 * 3));

      const first = threeWeeksAgo.getDate() - threeWeeksAgo.getDay() + 1;
      const sun = first + 6;
      const end = new Date(threeWeeksAgo.setDate(sun));

      const params = { userId: user.id, start: start, end: end };
      getWeeklySpending(params);
    }
  };

  const handleRightWeek = () => {
    if (isUpdateData === -1) {
      setIsUpdateData(0);
      const params = { userId: user.id, start: sdt, end: edt };
      getWeeklySpending(params);
    } else {
      setIsUpdateData(1);
      // get monday of the 3 week ago, 3주 전 월요일
      const threeWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 7 * 2));
      const mon = threeWeeksAgo.getDate() - threeWeeksAgo.getDay() + 1;
      const start = new Date(threeWeeksAgo.setDate(mon));

      // get sunday of the 3 weeks after, 3주 후 일요일
      const threeWeeksAfter = new Date(new Date().setDate(new Date().getDate() + 7 * 3));
      const first = threeWeeksAfter.getDate() - threeWeeksAfter.getDay() + 1;
      const sun = first + 6;
      const end = new Date(threeWeeksAfter.setDate(sun));

      const params = { userId: user.id, start: start, end: end };
      getWeeklySpending(params);
    }
  };

  // 주 클릭 시 해당 주의 list 모두 표출
  const handleWeekItemClick = (week) => {
    setDailyPayDate(week);
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
            Weekly
            <div className="float-right">
              <Button
                color=""
                className={s.transparentButton}
                size="xs"
                onClick={handleLeftWeek}
                style={{ cursor: isUpdateData === -1 ? "not-allowed" : null }}
                disabled={isUpdateData === -1 ? true : false}
              >
                <i className="fa fa-caret-left"></i>
              </Button>
              <Button
                color=""
                className={s.transparentButton}
                size="xs"
                onClick={handleRightWeek}
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
                      <ListGroupItem className={s.listGroupItems} key={idx} onClick={() => handleWeekItemClick(d.week)}>
                        <div
                          className={s.date}
                          style={{
                            color: d.week && moment() >= moment(d.week.split(" ~ ")[0]) && moment() <= moment(d.week.split(" ~ ")[1]) ? "#fff" : null,
                          }}
                        >
                          {d.week}
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
                      <ListGroupItem className={s.listGroupItems} key={idx} onClick={() => handleWeekItemClick(d.week)}>
                        <div
                          className={s.date}
                          style={{
                            color: d.week && moment() >= moment(d.week.split(" ~ ")[0]) && moment() <= moment(d.week.split(" ~ ")[1]) ? "#fff" : null,
                          }}
                        >
                          {d.week}
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
        type="weekly"
      />
    </>
  );
}
