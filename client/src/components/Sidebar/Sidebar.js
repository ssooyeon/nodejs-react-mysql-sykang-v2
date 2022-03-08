import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { Progress, Alert } from "reactstrap";
import Moment from "react-moment";
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup";

import { changeActiveSidebarItem } from "../../actions/navigation";
import HomeIcon from "../Icons/SidebarIcons/HomeIcon";
import TypographyIcon from "../Icons/SidebarIcons/TypographyIcon";
import TablesIcon from "../Icons/SidebarIcons/TablesIcon";
import NotificationsIcon from "../Icons/SidebarIcons/NotificationsIcon";
import ComponentsIcon from "../Icons/SidebarIcons/ComponentsIcon";

import ScheduleService from "../../services/ScheduleService";
import WeatherService from "../../services/WeatherService";

export default function Sidebar(props) {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [todaySchedules, setTodaySchedules] = useState([]);
  const [date, setDate] = useState("");
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");

  useEffect(() => {
    getSchedule();
    getTemp();
    getHumidity();
  }, []);

  // 오늘 날짜 스케줄 가져오기
  const getSchedule = () => {
    ScheduleService.getAllByToday()
      .then((res) => {
        console.log(res.data);
        setTodaySchedules(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 현재 온도 가져오기
  const getTemp = () => {
    WeatherService.getWeathers("first")
      .then((res) => {
        if (res !== null) {
          const date = res.baseDate + " " + res.baseTime;
          setDate(date);
          setTemp(res.t1h);
        } else {
          console.log("temp is null");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 현재 습도 가져오기
  const getHumidity = () => {
    WeatherService.getWeathers("second")
      .then((res) => {
        if (res !== null) {
          setHumidity(res.reh);
        } else {
          console.log("humidity is null");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <nav
      className={cx(s.root)}
      // ref={(nav) => {
      //   this.element = nav;
      // }}
    >
      <header className={s.logo}>
        <a href="/">
          🌚 <span className="fw-bold"></span>
        </a>
      </header>
      <ul className={s.nav}>
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Dashboard"
          isHeader
          iconName={<HomeIcon className={s.menuIcon} />}
          link="/app/main"
          index="main"
        />
        <LinksGroup
          onActiveSidebarItemChange={(t) => dispatch(changeActiveSidebarItem(t))}
          activeItem={props.activeItem}
          header="Users & Groups"
          isHeader
          iconName={<TypographyIcon className={s.menuIcon} />}
          link="/app/tables"
          index="tables"
        />
        <LinksGroup
          onActiveSidebarItemChange={(t) => dispatch(changeActiveSidebarItem(t))}
          activeItem={props.activeItem}
          header="Board"
          isHeader
          iconName={<NotificationsIcon className={s.menuIcon} />}
          link="/app/board"
          index="board"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) => dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Monitoring"
          isHeader
          iconName={<ComponentsIcon className={s.menuIcon} />}
          link="/app/monitoring"
          index="monitoring"
          childrenLinks={[
            {
              header: "Charts",
              link: "/app/monitoring/charts",
            },
          ]}
        />
        {currentUser ? (
          <>
            <LinksGroup
              onActiveSidebarItemChange={(t) => dispatch(changeActiveSidebarItem(t))}
              activeItem={props.activeItem}
              header="Profile"
              isHeader
              iconName={<TablesIcon className={s.menuIcon} />}
              link="/app/profile"
              index="profile"
            />
            <LinksGroup
              onActiveSidebarItemChange={(t) => dispatch(changeActiveSidebarItem(t))}
              activeItem={props.activeItem}
              header="Schedule"
              isHeader
              iconName={<TablesIcon className={s.menuIcon} />}
              link="/app/schedule"
              index="Schedule"
            />
            <LinksGroup
              onActiveSidebarItemChange={(t) => dispatch(changeActiveSidebarItem(t))}
              activeItem={props.activeItem}
              header="Task"
              isHeader
              iconName={<TablesIcon className={s.menuIcon} />}
              link="/app/task"
              index="Task"
            />
          </>
        ) : null}
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
        <Alert className={s.sidebarAlert} color="transparent" isOpen>
          <span>Temperature: {temp}℃</span>
          <br />
          <Progress className={`bg-subtle-blue progress-xs mt-1`} color="danger" value={(Math.abs(temp) / 40) * 100} />
          <span className={s.alertFooter} style={{ fontStyle: "italic", fontSize: "11px" }}>
            <Moment format="YYYY-MM-DD HH:mm">{date}</Moment> 기준
          </span>
        </Alert>
        <Alert className={s.sidebarAlert} color="transparent" isOpen>
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
