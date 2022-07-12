import React, { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import Moment from "react-moment";

import Widget from "../../../components/Widget";
import renderActiveShape from "../component/PieChartShape";

import s from "./Charts.module.scss";

import PayService from "../../../services/PayService";

export default function CatChart({ user, isListUpdated }) {
  const [catActiveIndex, setCatActiveIndex] = useState(0);
  const [dataByCat, setDataByCat] = useState([]);

  useEffect(() => {
    getDataByCat(user.id);
  }, [user, isListUpdated]);

  const getDataByCat = (id) => {
    PayService.getSpendingByCat({ userId: id })
      .then((res) => {
        setDataByCat(res.data);
      })
      .catch((e) => console.log(e));
  };

  // pie chart에서 mouse hover
  const onCatPieEnter = (_, index) => {
    setCatActiveIndex(index);
  };

  return (
    <>
      <Widget
        className={s.rootWidget}
        title={
          <h6>
            This month <span className="fw-semi-bold">Spending</span> by Category&nbsp;&nbsp;
            <span style={{ fontSize: "10px", fontStyle: "italic" }}>
              <Moment format="YYYY-MM">{new Date()}</Moment>
            </span>
          </h6>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart height={300}>
            <Pie
              activeIndex={catActiveIndex}
              activeShape={renderActiveShape}
              data={dataByCat}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              fill="#953434"
              dataKey="thismonth_spending"
              onMouseEnter={onCatPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      </Widget>
    </>
  );
}
