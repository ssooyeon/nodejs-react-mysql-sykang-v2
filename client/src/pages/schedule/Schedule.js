import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import rrulePlugin from "@fullcalendar/rrule";

import { Row, Col, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from "reactstrap";

import Widget from "../../components/Widget";
import s from "./Schedule.module.scss";
import "./Schedule.css";

import { retrieveSchedules, updateSchedule } from "../../actions/schedules";
import { retrieveGroups } from "../../actions/groups";
import ScheduleService from "../../services/ScheduleService";

export default function Schedule(props) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const schedules = useSelector((state) => state.schedules || []);
  const groups = useSelector((state) => state.groups || []);
  const dispatch = useDispatch();

  const [clickedDate, setClickedDate] = useState(new Date());
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false); // schedule create modal open
  const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false); // schedule update modal open
  const [editSchedule, setEditSchedule] = useState([]); // update 할 schedule object

  useEffect(() => {
    dispatch(retrieveSchedules());
  }, [dispatch]);

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Calendar - <span className="fw-semi-bold">Schedule</span>
      </h2>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">My Schedule</span>
            </h3>
            <p>
              {"Indicates a To-Do of "}
              <code>my schedule</code> with title, description, date.
            </p>
            <div className={s.overFlow}>
              <FullCalendar
                plugins={[dayGridPlugin, rrulePlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                fixedWeekCount={false}
                select={() => {}}
                events={schedules}
                eventClick={() => {}}
                eventAdd={() => {}}
                eventChange={() => {}}
                eventRemove={() => {}}
                eventContent={() => {}}
                eventAllow={() => {}}
                contentHeight={600}
              />
            </div>
            <br />
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
