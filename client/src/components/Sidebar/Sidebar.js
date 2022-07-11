import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { Progress, Alert } from "reactstrap";
import Moment from "react-moment";
import { MdDashboard, MdTaskAlt, MdColorLens } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { BsTable, BsFillCalendarCheckFill, BsCodeSlash } from "react-icons/bs";
import { AiOutlineLineChart, AiOutlineMail } from "react-icons/ai";

import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup";

import { changeActiveSidebarItem } from "../../actions/navigation";
import ScheduleService from "../../services/ScheduleService";
import WeatherService from "../../services/WeatherService";

export default function Sidebar() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const activeItem = useSelector((store) => store.navigation.activeItem);
  const sidebarOpened = useSelector((state) => state.navigation.sidebarOpened);
  const dispatch = useDispatch();

  const [todaySchedules, setTodaySchedules] = useState([]);
  const [date, setDate] = useState("");
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    getSchedule();
    getTemp();
    getHumidity();
  }, []);

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const getWindowWidth = () => {
    return window.innerWidth;
  };

  // 오늘 날짜 스케줄 가져오기
  const getSchedule = () => {
    if (currentUser) {
      ScheduleService.getAllByToday(currentUser.id)
        .then((res) => {
          setTodaySchedules(res.data);
        })
        .catch((e) => console.log(e));
    }
  };

  // 현재 온도 가져오기
  const getTemp = () => {
    WeatherService.getAllCurrent({ type: "first" })
      .then((res) => {
        if (res.data !== null) {
          const date = res.data.baseDate + " " + res.data.baseTime;
          setDate(date);
          setTemp(res.data.t1h);
        } else {
          console.log("temp is null");
        }
      })
      .catch((e) => console.log(e));
  };

  // 현재 습도 가져오기
  const getHumidity = () => {
    WeatherService.getAllCurrent({ type: "second" })
      .then((res) => {
        if (res.data !== null) {
          setHumidity(res.data.reh);
        } else {
          console.log("humidity is null");
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <nav className={cx(s.root)} style={{ height: windowWidth < 768 ? (sidebarOpened ? "auto" : "0") : "auto" }}>
      {/* <nav className={cx(s.root)}> */}
      <header className={s.logo}>
        <a href="/">
          🌚 <span className="fw-bold"></span>
        </a>
      </header>
      <ul className={s.nav}>
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={activeItem}
          header="Dashboard"
          isHeader
          iconName={<MdDashboard size={20} className={s.menuIcon} />}
          link="/app/main"
          index="main"
        />
        <LinksGroup
          onActiveSidebarItemChange={(t) => dispatch(changeActiveSidebarItem(t))}
          activeItem={activeItem}
          header="Users & Groups"
          isHeader
          iconName={<RiUserSettingsFill size={20} className={s.menuIcon} />}
          link="/app/tables"
          index="tables"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={activeItem}
          header="Board"
          isHeader
          iconName={<BsTable size={20} className={s.menuIcon} />}
          link="/app/board"
          index="board"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={activeItem}
          header="Monitoring"
          isHeader
          iconName={<AiOutlineLineChart size={20} className={s.menuIcon} />}
          link="/app/monitoring"
          index="monitoring"
          childrenLinks={[
            {
              header: "System",
              link: "/app/monitoring/system",
            },
            {
              header: "User",
              link: "/app/monitoring/user",
            },
            {
              header: "Task",
              link: "/app/monitoring/task",
            },
          ]}
        />
        {currentUser ? (
          <>
            {currentUser.type === null ? (
              <LinksGroup
                onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={activeItem}
                header="Profile"
                isHeader
                iconName={<FaUserEdit size={20} className={s.menuIcon} />}
                link="/app/profile"
                index="profile"
              />
            ) : null}
            <LinksGroup
              onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
              activeItem={activeItem}
              header="Pay"
              isHeader
              iconName={<BsFillCalendarCheckFill size={20} className={s.menuIcon} />}
              link="/app/pay"
              index="Pay"
            />
            <LinksGroup
              onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
              activeItem={activeItem}
              header="Schedule"
              isHeader
              iconName={<BsFillCalendarCheckFill size={20} className={s.menuIcon} />}
              link="/app/schedule"
              index="Schedule"
            />
            <LinksGroup
              onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
              activeItem={activeItem}
              header="Task"
              isHeader
              iconName={<MdTaskAlt size={20} className={s.menuIcon} />}
              link="/app/task"
              index="Task"
            />
            <LinksGroup
              onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
              activeItem={activeItem}
              header="Inbox"
              isHeader
              iconName={<AiOutlineMail size={20} className={s.menuIcon} />}
              link="/app/inbox"
              index="inbox"
            />
          </>
        ) : null}
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={activeItem}
          header="Formatter"
          isHeader
          iconName={<BsCodeSlash size={20} className={s.menuIcon} />}
          link="/app/formatter"
          index="formatter"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={activeItem}
          header="ColorPicker"
          isHeader
          iconName={<MdColorLens size={20} className={s.menuIcon} />}
          link="/app/colorpicker"
          index="colorpicker"
        />
      </ul>
      <h5 className={s.navTitle}>
        Today TODO
        {/* eslint-disable-next-line */}
      </h5>
      {/* eslint-disable */}
      <ul className={s.sidebarLabels}>
        {todaySchedules &&
          todaySchedules.map((schedule, index) => {
            return (
              <li key={schedule.id}>
                <a href="/#/app/schedule">
                  {schedule.isAllDay ? (
                    <>
                      <i className="fa fa-circle text-success mr-2" />
                      <span className={s.labelName} style={{ fontSize: "13px" }}>
                        {schedule.title}
                        <span style={{ fontStyle: "italic", fontSize: "11px" }}> (daily)</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-circle text-info mr-2" />
                      <span className={s.labelName} style={{ fontSize: "13px" }}>
                        {schedule.title}
                        <span style={{ fontStyle: "italic", fontSize: "11px" }}> ({schedule.start.split(" ")[1].slice(0, 5)}~)</span>
                      </span>
                    </>
                  )}
                </a>
              </li>
            );
          })}
      </ul>
      {/* eslint-enable */}
      {/* <h5 className={s.navTitle}>WEATHER</h5> */}
      <div className={s.sidebarAlerts}>
        <Alert className={s.sidebarAlert} color="transparent" isOpen={true}>
          <span>Temperature: {temp}℃</span>
          <br />
          <Progress className={`bg-subtle-blue progress-xs mt-1`} color="danger" value={(Math.abs(temp) / 40) * 100} />
          <span className={s.alertFooter} style={{ fontStyle: "italic", fontSize: "11px" }}>
            <Moment format="YYYY-MM-DD HH:mm">{date}</Moment> 기준
          </span>
        </Alert>
        <Alert className={s.sidebarAlert} color="transparent" isOpen={true}>
          <span>Humidity: {humidity}%</span>
          <br />
          <Progress className={`bg-subtle-blue progress-xs mt-1`} color="warning" value={(humidity / 90) * 100} />
          <span className={s.alertFooter} style={{ fontStyle: "italic", fontSize: "11px" }}>
            <Moment format="YYYY-MM-DD HH:mm">{date}</Moment> 기준
          </span>
        </Alert>
      </div>
    </nav>
  );
}
