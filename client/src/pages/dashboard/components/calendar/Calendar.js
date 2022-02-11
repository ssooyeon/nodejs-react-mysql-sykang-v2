import React, { useEffect, useState } from "react";
import DayNames from "./DayNames";
import uuid from "uuid/v4";
import Week from "./Week";
import moment from "moment/moment";
import s from "./Calendar.module.scss";

const initialMonthEvents = [
  {
    title: "The flower bed",
    info: "Contents here",
    itemStyle: "#1870dc",
    date: moment(`${moment().year()}-${moment().month() + 1}-02`, "YYYY-MM-DD"),
  },
  {
    title: "Stop world water pollution",
    info: "Have a kick off meeting with .inc company",
    itemStyle: "#f0b518",
    date: moment(`${moment().year()}-${moment().month() + 1}-05`, "YYYY-MM-DD"),
  },
  {
    title: "Light Blue Template 1.0.0 release",
    info: "Some contents here",
    itemStyle: "#2d8515",
    date: moment(`${moment().year()}-${moment().month() + 1}-18`, "YYYY-MM-DD"),
  },
  {
    title: "A link",
    info: "",
    itemStyle: "#f45722",
    link: "http://www.flatlogic.com",
    date: moment(`${moment().year()}-${moment().month() + 1}-29`, "YYYY-MM-DD"),
  },
];

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(moment().startOf("day"));
  const [selectedMonthEvents, setSelectedMonthEvents] = useState(initialMonthEvents);
  const [showEvents, setShowEvents] = useState(false);

  const previous = () => {
    setSelectedMonth(selectedMonth.subtract(1, "month"));
  };

  const next = () => {
    setSelectedMonth(selectedMonth.add(1, "month"));
  };

  const renderMonthLabel = () => {
    return <span className={`${s.calendarItemContainer} ${s.monthLabel}`}>{selectedMonth.format("MMMM YYYY")}</span>;
  };

  const renderWeeks = () => {
    const currentMonthView = selectedMonth;
    const currentSelectedDay = selectedDay;

    let weeks = [];
    let done = false;
    let previousCurrentNextView = currentMonthView.clone().startOf("month").subtract(1, "d").day("Sunday");
    let count = 0;
    let monthIndex = previousCurrentNextView.month();

    while (!done) {
      weeks.push(
        <Week
          key={uuid()}
          selectedMonthEvents={selectedMonthEvents}
          previousCurrentNextView={previousCurrentNextView.clone()}
          currentMonthView={currentMonthView}
          selected={currentSelectedDay}
        />
      );
      previousCurrentNextView.add(1, "w");
      done = count++ > 2 && monthIndex !== previousCurrentNextView.month();
      monthIndex = previousCurrentNextView.month();
    }
    return weeks;
  };

  return (
    <div className={`${s.calendarRectangle}`}>
      <div>
        <section className={`${s.mainCalendar}`}>
          <header className={`${s.calendarHeader}`}>
            <div className={`${s.calendarRow} ${s.titleHeader}`}>
              <i className={`${s.calendarItemContainer} ${s.arrow} la la-arrow-left`} onClick={previous} />
              <div className={`${s.calendarItemContainer} ${s.headerText}`}>{renderMonthLabel()}</div>
              <i className={`${s.calendarItemContainer} ${s.arrow} la la-arrow-right`} onClick={next} />
            </div>
            <DayNames />
          </header>
          <div className={`${s.daysContainer}`}>{renderWeeks()}</div>
        </section>
      </div>
    </div>
  );
}
