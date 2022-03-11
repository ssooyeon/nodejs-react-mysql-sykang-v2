import React from "react";
import Day from "./Day";
import { v4 as uuidv4 } from "uuid";
import moment from "moment/moment";
import s from "./Calendar.module.scss";

export default function Week(props) {
  let days = [];
  let date = props.previousCurrentNextView;
  const { selectedMonthEvents, selected, currentMonthView } = props;

  for (var i = 0; i < 7; i++) {
    let dayHasEvents = false,
      title = "",
      description = "",
      backgroundColor = "",
      link = "";

    for (var j = 0; j < selectedMonthEvents.length; j++) {
      const sdt = moment(selectedMonthEvents[j].start, "YYYY-MM-DD");
      if (sdt.isSame(date, "day")) {
        dayHasEvents = true;
        title = selectedMonthEvents[j].title ? selectedMonthEvents[j].title : "";
        description = selectedMonthEvents[j].description ? selectedMonthEvents[j].description : "";
        backgroundColor = selectedMonthEvents[j].backgroundColor ? selectedMonthEvents[j].backgroundColor : "";
        link = selectedMonthEvents[j].link ? selectedMonthEvents[j].link : "";
        // link = "/";
      }
    }

    let day = {
      name: date.format("dd").substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === currentMonthView.month(),
      isToday: date.isSame(new Date(), "day"),
      start: date,
      hasEvents: dayHasEvents,
      title: title,
      description: description,
      backgroundColor: backgroundColor,
      link: link,
    };

    days.push(<Day key={uuidv4()} day={day} selected={selected} />);
    date = date.clone();
    date.add(1, "d");
  }
  return <div className={`${s.calendarRow} ${s.week}`}>{days}</div>;
}
