import React, { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { Button } from "reactstrap";
import Moment from "react-moment";
import MonthPicker from "react-month-picker";

import Widget from "../../../components/Widget";
import renderActiveShape from "../component/PieChartShape";

import "react-month-picker/css/month-picker.css";
import s from "./Charts.module.scss";
import "./MonthPicker.css";

import PayService from "../../../services/PayService";
import CatPayModal from "./modal/CatPayModal";

const range = {
  min: { year: new Date().getFullYear() - 2, month: new Date().getMonth() + 1 },
  max: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
};
const lang = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CatChart({ user, isListUpdated }) {
  const [catActiveIndex, setCatActiveIndex] = useState(0);
  const [monthlyTotalSpending, setMonthlyTotalSpending] = useState(0);
  const [dataByCat, setDataByCat] = useState([]);
  const [isShowMonthPicker, setIsShowMonthPicker] = useState(false);
  const [monthYear, setMonthYear] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

  const [catPayModalOpen, setCatPayModalOpen] = useState(false);
  const [catPayModalCatId, setCatPayModalCatId] = useState(0);

  useEffect(() => {
    const params = {
      userId: user.id,
      date: `${getMonthValue()}-01`,
    };
    getDataByCat(params);
  }, [user, isListUpdated]);

  const getDataByCat = (params) => {
    PayService.getSpendingByCat(params)
      .then((res) => {
        setDataByCat(res.data);
        const spendings = res.data.map((x) => x.thismonth_spending);
        const total = spendings.reduce(function add(sum, v) {
          return sum + v;
        }, 0);
        setMonthlyTotalSpending(total);
      })
      .catch((e) => console.log(e));
  };

  // pie chart에서 mouse hover
  const onCatPieEnter = (_, index) => {
    setCatActiveIndex(index);
  };

  // month picker button click
  const showMonthPicker = (e) => {
    // e.preventDefault();
    setIsShowMonthPicker(true);
  };

  // change month value
  const handleMonthChange = (year, month) => {
    setMonthYear({ year, month });
    setIsShowMonthPicker(false);
    const params = {
      userId: user.id,
      date: `${year}-${month}-01`,
    };
    getDataByCat(params);
  };

  const handleMonthDismiss = () => {
    setIsShowMonthPicker(false);
  };

  const handlePieChartClick = (e) => {
    if (e.cat !== null) {
      setCatPayModalCatId(e.cat.id);
    } else {
      setCatPayModalCatId(null);
    }
    setCatPayModalOpen(true);
  };

  // CatPayModal.js 닫기 버튼 클릭
  const handleCatPayModalClick = (value) => {
    setCatPayModalOpen(value);
  };

  // get yyyy-mm value using month picker value
  const getMonthValue = () => {
    const m = monthYear && monthYear.month ? monthYear.month : 0;
    const y = monthYear && monthYear.year ? monthYear.year : 0;
    return m && y ? `${y}-${m}` : `-`;
  };

  return (
    <>
      <Widget
        style={{ height: "400px" }}
        className={s.rootWidget}
        title={
          <>
            <h6>
              Monthly <span className="fw-semi-bold">Spending</span> by Category
              <div className={s.dateWrapper}>
                <Button color="inverse" size="sm" onClick={showMonthPicker}>
                  {getMonthValue()}
                </Button>
                <MonthPicker
                  className={s.monthPicker}
                  show={isShowMonthPicker}
                  lang={lang}
                  years={range}
                  value={monthYear}
                  onChange={handleMonthChange}
                  onDismiss={handleMonthDismiss}
                  theme="dark"
                />
              </div>
            </h6>
            <div className={s.subTitle}>
              <span style={{ fontSize: "10px" }}>
                month: <Moment format="YYYY-MM">{getMonthValue()}</Moment>
              </span>
              <br />
              <span style={{ fontSize: "10px" }}>total: {monthlyTotalSpending.toLocaleString()}</span>
            </div>
          </>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          {monthlyTotalSpending === 0 ? (
            <div style={{ textAlign: "center", height: "100%", display: "grid", alignItems: "center" }}>no data</div>
          ) : (
            <PieChart>
              <Pie
                activeIndex={catActiveIndex}
                activeShape={renderActiveShape}
                data={dataByCat}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#6E4141"
                dataKey="thismonth_spending"
                onMouseEnter={onCatPieEnter}
                onClick={handlePieChartClick}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Widget>

      <CatPayModal open={catPayModalOpen} handleCloseClick={handleCatPayModalClick} user={user} date={getMonthValue()} catId={catPayModalCatId} />
    </>
  );
}
