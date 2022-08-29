import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import moment from "moment/moment";

import Widget from "../../../components/Widget";
import "./Calendar.css";

import DailyPayModal from "./modal/DailyPayModal";
import AddPayModal from "../pay/modal/AddPayModal";

import { retrievePays } from "../../../actions/pays";

export default function Calendar({ user, someUpdate, isListUpdated }) {
  const asserts = useSelector((state) => state.asserts || []);
  const cats = useSelector((state) => state.cats || []);

  const [data, setData] = useState([]);

  const [dailyPayModalOpen, setDailyPayModalOpen] = useState(false);
  const [dailyPayDate, setDailyPayDate] = useState(new Date());

  const [payAddModalOpen, setPayAddModalOpen] = useState(false);
  const [payAddDate, setPayAddDate] = useState(new Date());

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrievePays({ userId: user.id }))
      .then((res) => {
        const diff = reducePayment(res, "diff");

        const incomeList = res.filter((x) => x.amount > 0);
        const income = reducePayment(incomeList, "income");

        const spendingList = res.filter((x) => x.amount < 0);
        const spending = reducePayment(spendingList, "spending");

        let result = [...diff, ...income, ...spending];
        result = result.map((e) => {
          e.title = e.title.toLocaleString();
          return e;
        });
        setData(result);
      })
      .catch((e) => console.log(e));
  }, [user, dispatch, isListUpdated]);

  // payment list를 calendar에 맞게 type별로 변환
  const reducePayment = (arr, type) => {
    const list = arr.reduce((acc, { date, amount }) => {
      const start = moment(date).format("YYYY-MM-DD 09:00:00");
      acc[start] = acc[start] || { start, title: 0 };
      acc[start].title += amount;
      acc[start].type = type;
      return acc;
    }, {});
    return Object.values(list);
  };

  // 날짜 클릭: notworking
  const handleDateSelect = (e) => {
    setPayAddDate(e.start);
    setPayAddModalOpen(true);
  };

  // 기존 스케줄 클릭: 하루치 payment list view
  const handleEventClick = (e) => {
    setDailyPayDate(e.event.start);
    setDailyPayModalOpen(true);
  };

  // 신규 스케줄 추가 후 콜백 함수
  const handleEventAdd = (e) => {
    console.log("add schedule");
  };

  // 스케줄 렌더링 전 호출 함수
  const handleEventContent = (e) => {
    const type = e.event.extendedProps.type;
    let html = "";
    if (type === "diff") {
      html =
        "<div class='fc-daygrid-event-dot' style='border-color:rgba(244, 244, 245, 0.6);'></div><div class='fc-event-title' style='font-weight:400;color:rgba(244, 244, 245, 0.6)'>" +
        e.event.title +
        "</div>";
    } else if (type === "income") {
      html =
        "<div class='fc-daygrid-event-dot' style='border-color:#7676fb;'></div><div class='fc-event-title' style='font-weight:400;color:#7676fb'>" +
        e.event.title +
        "</div>";
    } else if (type === "spending") {
      html =
        "<div class='fc-daygrid-event-dot' style='border-color:#dd2222;'></div><div class='fc-event-title' style='font-weight:400;color:#dd2222'>" +
        e.event.title +
        "</div>";
    }
    return {
      html: html,
    };
  };

  // DailyPayModal.js에서 닫기 버튼 클릭
  const handleDailyPayModalClick = (value) => {
    setDailyPayModalOpen(value);
  };

  // daily payment 등록 버튼 클릭 및 AddPayModal.js에서 닫기 버튼 클릭
  const handlePayAddModalClick = (value, isDone) => {
    setPayAddModalOpen(value);
    if (isDone) {
      dispatch(retrievePays({ userId: user.id }));
      someUpdate();
    }
  };

  return (
    <>
      <Widget style={{ height: "550px" }}>
        <h3>
          <span className="fw-semi-bold">Calendar</span>
        </h3>
        <br />
        <div className="payment_calendar">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "today",
              center: "title",
              right: "prev,next",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            fixedWeekCount={false}
            select={handleDateSelect}
            events={data}
            eventClick={handleEventClick}
            eventAdd={handleEventAdd}
            eventContent={handleEventContent}
            contentHeight={350}
            displayEventTime={false}
            eventOrder="type"
          />
        </div>
      </Widget>

      <DailyPayModal open={dailyPayModalOpen} someUpdate={someUpdate} handleCloseClick={handleDailyPayModalClick} user={user} date={dailyPayDate} />
      <AddPayModal open={payAddModalOpen} handleCloseClick={handlePayAddModalClick} asserts={asserts} cats={cats} date={payAddDate} />
    </>
  );
}
