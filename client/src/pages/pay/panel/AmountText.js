import React, { useEffect, useState } from "react";
import Moment from "react-moment";

import Widget from "../../../components/Widget";

import PayService from "../../../services/PayService";

export default function AmountText({ user, isListUpdated }) {
  const [todayIncome, setTodayIncome] = useState(0);
  const [todaySpending, setTodaySpending] = useState(0);
  const [todaySpendingDiff, setTodaySpendingDiff] = useState(0);

  const [monthIncome, setMonthIncome] = useState(0);
  const [monthSpending, setMonthSpending] = useState(0);
  const [monthSpendingDiff, setMonthSpendingDiff] = useState(0);

  useEffect(() => {
    getTodayAmounts(user.id);
    getMonthAmounts(user.id);
  }, [user, isListUpdated]);

  const getTodayAmounts = (id) => {
    PayService.getTodayAmount({ userId: id }).then((res) => {
      const income = res.data[0].today_income;
      const spending = res.data[0].today_spending;
      const diff = res.data[0].yesterday_spending;
      if (income !== null) {
        setTodayIncome(parseInt(income));
      }
      if (spending !== null) {
        setTodaySpending(parseInt(spending));
      }
      if (diff !== null) {
        const diffAbs = Math.abs(parseInt(spending)) - Math.abs(parseInt(diff));
        setTodaySpendingDiff(diffAbs);
      }
    });
  };

  const getMonthAmounts = (id) => {
    PayService.getMonthAmount({ userId: id }).then((res) => {
      const income = res.data[0].thismonth_income;
      const spending = res.data[0].thismonth_spending;
      const diff = res.data[0].lastmonth_spending;
      if (income !== null) {
        setMonthIncome(parseInt(income));
      }
      if (spending !== null) {
        setMonthSpending(parseInt(spending));
      }
      if (diff !== null) {
        const diffAbs = Math.abs(parseInt(spending)) - Math.abs(parseInt(diff));
        setMonthSpendingDiff(diffAbs);
      }
    });
  };

  return (
    <>
      <Widget
        title={
          <h6>
            Today&nbsp;&nbsp;
            <span style={{ fontSize: "10px", fontStyle: "italic" }}>
              <Moment format="YYYY-MM-DD">{new Date()}</Moment>
            </span>
          </h6>
        }
      >
        <div className="stats-row">
          <div className="stat-item">
            <h6 className="name">Income</h6>
            <p className="value" style={{ color: "#7676fb" }}>
              {todayIncome.toLocaleString()}
            </p>
          </div>
          <div className="stat-item">
            <h6 className="name">Spending</h6>
            <p className="value" style={{ color: "#dd2222" }}>
              {todaySpending.toLocaleString()}
            </p>
          </div>
        </div>
        <p>
          <small>
            <span className="circle bg-default text-white mr-2">
              <i className="fa fa-chevron-up" />
            </span>
          </small>
          {todaySpendingDiff > 0 ? (
            <>
              Spent<span className="fw-semi-bold">&nbsp; {todaySpendingDiff.toLocaleString()} </span> more than yesterday.
            </>
          ) : (
            <>
              Spent<span className="fw-semi-bold">&nbsp; {Math.abs(todaySpendingDiff).toLocaleString()} </span> less than yesterday.
            </>
          )}
        </p>
      </Widget>
      <Widget
        title={
          <h6>
            This month&nbsp;&nbsp;
            <span style={{ fontSize: "10px", fontStyle: "italic" }}>
              <Moment format="YYYY-MM">{new Date()}</Moment>
            </span>
          </h6>
        }
      >
        <div className="stats-row">
          <div className="stat-item">
            <h6 className="name">Income</h6>
            <p className="value" style={{ color: "#7676fb" }}>
              {monthIncome.toLocaleString()}
            </p>
          </div>
          <div className="stat-item">
            <h6 className="name">Spending</h6>
            <p className="value" style={{ color: "#dd2222" }}>
              {monthSpending.toLocaleString()}
            </p>
          </div>
        </div>
        <p>
          <small>
            <span className="circle bg-default text-white mr-2">
              <i className="fa fa-chevron-up" />
            </span>
          </small>
          {monthSpendingDiff > 0 ? (
            <>
              Spent<span className="fw-semi-bold">&nbsp; {monthSpendingDiff.toLocaleString()} </span> more than last month.
            </>
          ) : (
            <>
              Spent<span className="fw-semi-bold">&nbsp; {Math.abs(monthSpendingDiff).toLocaleString()} </span> less than last month.
            </>
          )}
        </p>
      </Widget>
    </>
  );
}
