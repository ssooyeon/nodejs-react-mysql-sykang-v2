import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DayNames from "./DayNames";
import { v4 as uuidv4 } from "uuid";
import Week from "./Week";
import moment from "moment/moment";
import s from "./Calendar.module.scss";

import { retrieveSchedules } from "../../../actions/schedules";
// import ScheduleService from "../../../services/ScheduleService";

const selectedDay = moment().startOf("day");

export default function Calendar() {
  const schedules = useSelector((state) => state.schedules || []);
  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState(moment());

  useEffect(() => {
    dispatch(retrieveSchedules());
  }, [dispatch]);

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
          key={uuidv4()}
          selectedMonthEvents={schedules}
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
    <>
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

      <div className="list-group fs-mini">
        {schedules &&
          schedules
            .filter((x) => x.start.split(" ")[0] === moment().format("YYYY-MM-DD"))
            .map((schedule, key) => {
              const dt = schedule.start.split(" ");
              let time = dt[1];
              if (time !== undefined) {
                time = time.substr(0, 5);
              }
              return (
                <button className="list-group-item text-ellipsis" key={key}>
                  {time && time !== undefined ? (
                    <span className="badge badge-pill badge-warning float-right">{time}</span>
                  ) : (
                    <span className="badge badge-pill badge-primary float-right">all day</span>
                  )}
                  {schedule.title} &nbsp;
                  <span style={{ fontStyle: "italic", fontSize: "12px", color: "rgba(244, 244, 245, 0.6)" }}>({schedule.creater.account})</span>
                </button>
              );
            })}
      </div>
    </>
  );
}
