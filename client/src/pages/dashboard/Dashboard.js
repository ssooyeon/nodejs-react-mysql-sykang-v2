import React, { useEffect, useState } from "react";
import { Row, Col, Progress, Button } from "reactstrap";
import Moment from "react-moment";
import Widget from "../../components/Widget";
import Calendar from "./components/calendar/Calendar";
import AnimateNumber from "react-animated-number";
import s from "./Dashboard.module.scss";

import MonitoringService from "../../services/MonitoringService";
import LogService from "../../services/LogService";
import WeatherService from "../../services/WeatherService";

const precipitations = ["N/A", "Rain", "Rain/Snow", "Snow", "Shower"];
const skys = ["", "Sunny", "", "A lot of Clouds", "Cloudy"];

export default function Dashboard() {
  const initialWeather = {
    baseDateTime: "",
    fcstDateTime: "",
    precipitationStatus: "", // 강수형태
    precipitation: "", // 강수량
    skyStatus: "", // 하늘상태
    temp: "", // 기온
    humidity: "", // 습도
    windDirection: "", // 풍향
    windSpeed: "", // 풍속
  };
  const initialPastWeather = {
    temp: "", // 기온
    humidity: "", // 습도
    windSpeed: "", // 풍속
  };

  const [cpuPercent, setCpuPercent] = useState(0);
  const [memoryPercent, setMemoryPercent] = useState(0);
  const [diskPercent, setDiskPercent] = useState(0);

  const [weatherData, setWeatherData] = useState(initialWeather);
  const [pastWeatherData, setPastWeatherData] = useState(initialPastWeather);

  const [logList, setLogList] = useState([]);

  useEffect(() => {
    getSystemUsage();
    getWeather();
  }, []);

  const getSystemUsage = () => {
    getCpuPercent();
    getMemoryPercent();
    getDiskPercent();
    getLogList();
  };

  const getCpuPercent = () => {
    MonitoringService.getCPUUsage()
      .then((res) => {
        const cpu = res.data;
        setCpuPercent(parseInt(cpu));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getMemoryPercent = () => {
    MonitoringService.getMemoryUsage()
      .then((res) => {
        const mem = res.data;
        setMemoryPercent(parseInt(mem));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getDiskPercent = () => {
    MonitoringService.getDiskUsage()
      .then((res) => {
        const disk = res.data;
        setDiskPercent(parseInt(disk));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getWeather = () => {
    WeatherService.getWeathers()
      .then((res) => {
        if (res !== null) {
          const weather = {
            baseDateTime: res.baseDate + " " + res.baseTime,
            fcstDateTime: res.fcstDate + " " + res.fcstTime,
            precipitationStatus: precipitations[res.pty], // 강수형태1-4
            precipitation: res.rn1, // 강수량mm
            skyStatus: skys[res.sky], // 하늘상태1-4
            temp: res.t1h, // 기온c
            humidity: res.reh, // 습도%
            windDirection: res.vec, // 풍향deg
            windSpeed: res.wsd, // 풍속m/s
          };
          setWeatherData(weather);
          getPastWeather();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getPastWeather = () => {
    WeatherService.getPastWeathers()
      .then((res) => {
        const pastWeather = {
          temp: res.t1h, // 기온c
          humidity: res.reh, // 습도%
          windSpeed: res.wsd, // 풍속m/s
        };
        setPastWeatherData(pastWeather);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getLogList = () => {
    LogService.getAll()
      .then((res) => {
        setLogList(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const isSameDay = (date) => {
    const day = new Date(date).getDay();
    const today = new Date().getDay();
    return day === today;
  };

  return (
    <div className={s.root}>
      <h1 className="page-title">Dashboard &nbsp;</h1>

      <Row>
        <Col lg={7}>
          <Widget title={""} bodyClass={"pt-2 px-0 py-0"}>
            <Calendar />
            <div className="list-group fs-mini">
              <button className="list-group-item text-ellipsis">
                <span className="badge badge-pill badge-primary float-right">13:30</span>
                Today's to do #1
              </button>
              <button className="list-group-item text-ellipsis">
                <span className="badge badge-pill badge-success float-right">17:00</span>
                Today's to do #2
              </button>
            </div>
          </Widget>
        </Col>
        <Col lg={5}>
          <Widget
            className="bg-transparent"
            title={
              <h5>
                {" "}
                System
                <span className="fw-semi-bold">&nbsp;Usage</span>
                &nbsp;&nbsp;
                <Button color="inverse" className="social-button" size="xs" onClick={getSystemUsage}>
                  <i className="la la-refresh"></i>
                </Button>
              </h5>
            }
            refresh
          >
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">CPU usage</p>
                <Progress color="primary" value={cpuPercent} className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={cpuPercent} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">Memory usage</p>
                <Progress color="danger" value={memoryPercent} className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={memoryPercent} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <div className="row progress-stats">
              <div className="col-md-11 col-12">
                <p className="description deemphasize mb-xs text-white">Disk usage</p>
                <Progress color="success" value={diskPercent} className="bg-subtle-blue progress-xs" />
              </div>
              <div className="col-md-1 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={diskPercent} />%
                  </small>
                </span>
              </div>
            </div>
            <br />
            <p>
              <span className="circle bg-default text-white">
                <i className="fa fa-cog" />
              </span>
              &nbsp; It is not updated in real time, and the data is updated through the refresh icon at the top.
            </p>
          </Widget>
        </Col>
      </Row>

      <Row>
        <Col lg={6} xl={4} xs={12}>
          <Widget title={<h6> Location </h6>}>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Location</h6>
                <p className="value">Korea / Daejeon</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Temperature</h6>
                <p className="value">
                  {weatherData.temp} ℃ / {weatherData.skyStatus}
                </p>
              </div>
            </div>
            <Progress color="danger" value={40 / Math.abs(weatherData.temp)} className="bg-subtle-blue progress-xs" />
            <p>
              {weatherData.temp - pastWeatherData.temp > 0 ? (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-up" />
                    </span>
                  </small>
                  Temperature<span className="fw-semi-bold">&nbsp;{weatherData.temp - pastWeatherData.temp}℃ higher</span>
                  &nbsp;than yesterday
                </>
              ) : (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-down" />
                    </span>
                  </small>
                  Temperature<span className="fw-semi-bold">&nbsp;{Math.abs(weatherData.temp - pastWeatherData.temp)}℃ lower</span>
                  &nbsp;than yesterday
                </>
              )}
            </p>
            {/* <p>
              <span className="fw-semi-bold">
                lasted updated: <Moment format="YYYY-MM-DD HH:mm">{weatherData.baseDateTime}</Moment>
              </span>
            </p> */}
          </Widget>
        </Col>
        <Col lg={6} xl={4} xs={12}>
          <Widget title={<h6> Humidity & Precipitation </h6>}>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Humidity</h6>
                <p className="value">{weatherData.humidity} %</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Precipitation Status</h6>
                <p className="value">{weatherData.precipitationStatus}</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Precipitation Volumn</h6>
                <p className="value">{weatherData.precipitation === "강수없음" ? "N/A" : <>{weatherData.precipitation} mm</>}</p>
              </div>
            </div>
            <Progress color="success" value={weatherData.humidity} className="bg-subtle-blue progress-xs" />
            <p>
              {weatherData.humidity - pastWeatherData.humidity > 0 ? (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-up" />
                    </span>
                  </small>
                  Humidity<span className="fw-semi-bold">&nbsp;{weatherData.humidity - pastWeatherData.humidity}% higher</span>
                  &nbsp;than yesterday
                </>
              ) : (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-down" />
                    </span>
                  </small>
                  Humidity<span className="fw-semi-bold">&nbsp;{Math.abs(weatherData.humidity - pastWeatherData.humidity)}% lower</span>
                  &nbsp;than yesterday
                </>
              )}
            </p>
          </Widget>
        </Col>
        <Col lg={6} xl={4} xs={12}>
          <Widget title={<h6> Wind </h6>}>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Wind Direction</h6>
                <p className="value">{weatherData.windDirection} deg</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Wind Speed</h6>
                <p className="value">{weatherData.windSpeed} m/s</p>
              </div>
            </div>
            <Progress color="primary" value={weatherData.windSpeed * 2} className="bg-subtle-blue progress-xs" />
            <p>
              {weatherData.windSpeed - pastWeatherData.windSpeed > 0 ? (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-up" />
                    </span>
                  </small>
                  Wind Speed<span className="fw-semi-bold">&nbsp;{weatherData.windSpeed - pastWeatherData.windSpeed}m/s faster</span>
                  &nbsp;than yesterday
                </>
              ) : (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-down" />
                    </span>
                  </small>
                  Wind Speed<span className="fw-semi-bold">&nbsp;{Math.abs(weatherData.windSpeed - pastWeatherData.windSpeed)}m/s slower</span>
                  &nbsp;than yesterday
                </>
              )}
            </p>
          </Widget>
        </Col>
      </Row>

      <Row>
        <Col lg={12} xs={12}>
          <Widget title={<h6> Logs</h6>} refresh>
            <div className="widget-body undo_padding">
              <div className="list-group list-group-lg">
                {logList.map((log) => {
                  return (
                    <button className="list-group-item text-left" key={log.id} style={{ padding: "0.75rem" }}>
                      <span className="thumb-sm float-left mr">
                        {log.status === "BASIC" ? (
                          <>
                            <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#374c37" }}>
                              <p style={{ margin: "7px" }}>B</p>
                            </span>
                            <i className="status status-bottom bg-success" />
                          </>
                        ) : log.status === "SUCCESS" ? (
                          <>
                            <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#3e5984" }}>
                              <p style={{ margin: "7px" }}>S</p>
                            </span>
                            <i className="status status-bottom bg-primary" />
                          </>
                        ) : (
                          <>
                            <span className={`${s.avatar} rounded-circle thumb-sm float-left`} style={{ background: "#b84a4a" }}>
                              <p style={{ margin: "7px" }}>E</p>
                            </span>
                            <i className="status status-bottom bg-danger" />
                          </>
                        )}
                      </span>
                      <div>
                        {log.status === "BASIC" ? (
                          <h6 className="m-0" style={{ color: "green" }}>
                            {log.status}
                          </h6>
                        ) : log.status === "SUCCESS" ? (
                          <h6 className="m-0" style={{ color: "#2477ff" }}>
                            {log.status}
                          </h6>
                        ) : (
                          <h6 className="m-0" style={{ color: "red" }}>
                            {log.status}
                          </h6>
                        )}
                        <p className="help-block text-ellipsis m-0 float-left">{log.message}</p>
                        <p className="help-block text-ellipsis float-right" style={{ margin: 0 }}>
                          {isSameDay(log.createdAt) ? (
                            <span style={{ fontStyle: "italic" }}>Just Today &nbsp;</span>
                          ) : (
                            <Moment format="YYYY-MM-DD HH:mm:ss">{log.createdAt}</Moment>
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <footer className="bg-widget-transparent mt">
              <input type="search" className="form-control form-control-sm bg-custom-dark border-0" placeholder="Search" />
            </footer>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
