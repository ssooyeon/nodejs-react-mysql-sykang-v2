import React, { useEffect, useState } from "react";
import { Row, Col, Progress, Button, FormGroup, InputGroup, Input } from "reactstrap";
import Moment from "react-moment";
import Widget from "../../components/Widget";
import Calendar from "./calendar/Calendar";
import AnimateNumber from "react-animated-number";
import dateTime from "date-and-time";
import s from "./Dashboard.module.scss";

import MonitoringService from "../../services/MonitoringService";
import LogService from "../../services/LogService";
import WeatherService from "../../services/WeatherService";

const precipitations = ["N/A", "Rain", "Rain/Snow", "Snow", "Shower"];
const skys = ["", "Sunny", "", "A lot of Clouds", "Cloudy"];

export default function Dashboard() {
  const initial1stWeather = {
    baseDateTime: "", // 발표날짜
    fcstDateTime: "", // 측정날짜
    skyStatus: "", // 하늘상태
    temp: "", // 기온
  };

  const initial2ndWeather = {
    baseDateTime: "", // 발표날짜
    fcstDateTime: "", // 측정날짜
    humidity: "", // 습도
    precipitationStatus: "", // 강수형태
    precipitation: "", // 강수량
  };

  const initial3rdWeather = {
    baseDateTime: "", // 발표날짜
    fcstDateTime: "", // 측정날짜
    windDirection: "", // 풍향
    windSpeed: "", // 풍속
  };

  const [cpuPercent, setCpuPercent] = useState(0);
  const [memoryPercent, setMemoryPercent] = useState(0);
  const [diskPercent, setDiskPercent] = useState(0);
  const [systemUpdateDate, setSystemUpdateDate] = useState(new Date());

  const [firstWeatherData, setFirstWeatherData] = useState(initial1stWeather);
  const [secondWeatherData, setSecondWeatherData] = useState(initial2ndWeather);
  const [thirdWeatherData, setThirdWeatherData] = useState(initial3rdWeather);

  const [pastTemp, setPastTemp] = useState("");
  const [pastHumidity, setPastHumidity] = useState("");
  const [pastWindSpeed, setPastWindSpeed] = useState("");

  const [logList, setLogList] = useState([]);
  const [searchLogMsg, setSearchLogMsg] = useState("");
  const [logUpdateDate, setLogUpdateDate] = useState(new Date());

  useEffect(() => {
    getSystemUsage();
    getAllWeather();
    getLogList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 시스템 사용량
  const getSystemUsage = () => {
    getCpuPercent();
    getMemoryPercent();
    getDiskPercent();
    setSystemUpdateDate(new Date());
  };

  // cpu usage
  const getCpuPercent = () => {
    MonitoringService.getCPUUsage()
      .then((res) => {
        const cpu = res.data;
        setCpuPercent(parseInt(cpu));
      })
      .catch((e) => console.log(e));
  };

  // memory usage
  const getMemoryPercent = () => {
    MonitoringService.getMemoryUsage()
      .then((res) => {
        const mem = res.data;
        setMemoryPercent(parseInt(mem));
      })
      .catch((e) => console.log(e));
  };

  // disk usage
  const getDiskPercent = () => {
    MonitoringService.getDiskUsage()
      .then((res) => {
        const disk = res.data;
        setDiskPercent(parseInt(disk));
      })
      .catch((e) => console.log(e));
  };

  // 모든 날씨 정보 조회
  const getAllWeather = () => {
    get1stWeather();
    get2ndWeather();
    get3rdWeather();
  };

  // 첫번째 블록 날씨 정보 조회 (지역, 하늘상태, 기온)
  const get1stWeather = () => {
    WeatherService.getAllCurrent({ type: "first" })
      .then((res) => {
        if (res.data !== null) {
          const weather = {
            baseDateTime: res.data.baseDate + " " + res.data.baseTime, // 발표날짜
            fcstDateTime: res.data.fcstDate + " " + res.data.fcstTime, // 측정날짜
            skyStatus: skys[res.data.sky], // 하늘상태1-4
            temp: res.data.t1h, // 기온c
          };
          setFirstWeatherData(weather);

          // 하루 전 온도 조회
          WeatherService.getAllPast({ type: "temp" }).then((res) => {
            setPastTemp(res.data);
          });
        } else {
          console.log("1st weather is null");
        }
      })
      .catch((e) => console.log(e));
  };

  // 두번째 블록 날씨 정보 조회 (습도, 강수형태, 강수량)
  const get2ndWeather = () => {
    WeatherService.getAllCurrent({ type: "second" })
      .then((res) => {
        if (res.data !== null) {
          const weather = {
            baseDateTime: res.data.baseDate + " " + res.data.baseTime, // 발표날짜
            fcstDateTime: res.data.fcstDate + " " + res.data.fcstTime, // 측정날짜
            humidity: res.data.reh, // 습도%
            precipitationStatus: precipitations[res.data.pty], // 강수형태1-4
            precipitation: res.data.rn1, // 강수량mm
          };
          setSecondWeatherData(weather);
          // 하루 전 습도 조회
          WeatherService.getAllPast({ type: "humidity" }).then((res) => {
            setPastHumidity(res.data);
          });
        } else {
          console.log("2nd weather is null");
        }
      })
      .catch((e) => console.log(e));
  };

  // 세번째 블록 날씨 정보 조회 (풍향, 풍속)
  const get3rdWeather = () => {
    WeatherService.getAllCurrent({ type: "third" })
      .then((res) => {
        if (res.data !== null) {
          const weather = {
            baseDateTime: res.data.baseDate + " " + res.data.baseTime, // 발표날짜
            fcstDateTime: res.data.fcstDate + " " + res.data.fcstTime, // 측정날짜
            windDirection: res.data.vec, // 풍향deg
            windSpeed: res.data.wsd, // 풍속m/s
          };
          setThirdWeatherData(weather);
          // 하루 전 풍속 조회
          WeatherService.getAllPast({ type: "wind" }).then((res) => {
            setPastWindSpeed(res.data);
          });
        } else {
          console.log("3rd weather is null");
        }
      })
      .catch((e) => console.log(e));
  };

  // 로그 리스트 중 최신 10개 조회
  const getLogList = () => {
    setSearchLogMsg("");
    setLogUpdateDate(new Date());
    LogService.getAll()
      .then((res) => {
        setLogList(res.data);
      })
      .catch((e) => console.log(e));
  };

  // 로그 생성 날짜가 오늘 날짜인지 확인 (Just Today 문구를 위함)
  const isSameDay = (date) => {
    const day = dateTime.format(new Date(date), "YYYYMMDD");
    const today = dateTime.format(new Date(), "YYYYMMDD");
    return day === today;
  };

  // 로그 리스트 하단 검색 함수
  const searchLog = () => {
    if (searchLogMsg === "" || searchLogMsg === undefined || searchLogMsg === null) {
      getLogList();
    } else {
      LogService.findByMessage(searchLogMsg)
        .then((res) => {
          setLogList(res.data);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div className={s.root}>
      <h1 className="page-title">Dashboard &nbsp;</h1>

      <Row>
        <Col lg={7}>
          <Widget title={""} bodyClass={"pt-2 px-0 py-0"}>
            <Calendar />
          </Widget>
        </Col>
        <Col lg={5}>
          <Widget
            className="bg-transparent"
            title={
              <h5>
                {" "}
                System
                <span className="fw-semi-bold">&nbsp;Usage</span>&nbsp;
                <span style={{ fontSize: "10px", fontStyle: "italic" }}>
                  lasted updated: <Moment format="YYYY-MM-DD HH:mm">{systemUpdateDate}</Moment>
                </span>
              </h5>
            }
            dataType="system-usage"
            refreshFun={getSystemUsage}
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
                    <AnimateNumber value={cpuPercent} stepPrecision={0} />%
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
                    <AnimateNumber value={memoryPercent} stepPrecision={0} />%
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
                    <AnimateNumber value={diskPercent} stepPrecision={0} />%
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
          <Widget
            title={
              <h6>
                {" "}
                Location{" "}
                <span style={{ fontSize: "10px", fontStyle: "italic" }}>
                  lasted updated: <Moment format="YYYY-MM-DD HH:mm">{firstWeatherData.baseDateTime}</Moment>
                </span>
              </h6>
            }
            dataType="weather-temp"
            refreshFun={get1stWeather}
            refresh
          >
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Location</h6>
                <p className="value">Korea / Daejeon</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Temperature</h6>
                <p className="value">
                  {firstWeatherData.temp} ℃ / {firstWeatherData.skyStatus}
                </p>
              </div>
            </div>
            <Progress color="danger" value={(Math.abs(firstWeatherData.temp) / 40) * 100} className="bg-subtle-blue progress-xs" />
            <p>
              {firstWeatherData.temp - pastTemp > 0 ? (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-up" />
                    </span>
                  </small>
                  Temperature<span className="fw-semi-bold">&nbsp;{firstWeatherData.temp - pastTemp}℃ higher</span>
                  &nbsp;than yesterday
                </>
              ) : (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-down" />
                    </span>
                  </small>
                  Temperature<span className="fw-semi-bold">&nbsp;{Math.abs(firstWeatherData.temp - pastTemp)}℃ lower</span>
                  &nbsp;than yesterday
                </>
              )}
            </p>
          </Widget>
        </Col>
        <Col lg={6} xl={4} xs={12}>
          <Widget
            title={
              <h6>
                {" "}
                Humidity & Precipitation{" "}
                <span style={{ fontSize: "10px", fontStyle: "italic" }}>
                  lasted updated: <Moment format="YYYY-MM-DD HH:mm">{secondWeatherData.baseDateTime}</Moment>
                </span>
              </h6>
            }
            dataType="weather-humidity"
            refreshFun={get2ndWeather}
            refresh
          >
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Humidity</h6>
                <p className="value">{secondWeatherData.humidity} %</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Precipitation Status</h6>
                <p className="value">{secondWeatherData.precipitationStatus}</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Precipitation Volumn</h6>
                <p className="value">{secondWeatherData.precipitation === "강수없음" ? "N/A" : <>{secondWeatherData.precipitation} mm</>}</p>
              </div>
            </div>
            <Progress color="success" value={(secondWeatherData.humidity / 90) * 100} className="bg-subtle-blue progress-xs" />
            <p>
              {secondWeatherData.humidity - pastHumidity > 0 ? (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-up" />
                    </span>
                  </small>
                  Humidity<span className="fw-semi-bold">&nbsp;{secondWeatherData.humidity - pastHumidity}% higher</span>
                  &nbsp;than yesterday
                </>
              ) : (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-down" />
                    </span>
                  </small>
                  Humidity<span className="fw-semi-bold">&nbsp;{Math.abs(secondWeatherData.humidity - pastHumidity)}% lower</span>
                  &nbsp;than yesterday
                </>
              )}
            </p>
          </Widget>
        </Col>
        <Col lg={6} xl={4} xs={12}>
          <Widget
            title={
              <h6>
                {" "}
                Wind{" "}
                <span style={{ fontSize: "10px", fontStyle: "italic" }}>
                  lasted updated: <Moment format="YYYY-MM-DD HH:mm">{thirdWeatherData.baseDateTime}</Moment>
                </span>
              </h6>
            }
            dataType="weather-wind"
            refreshFun={get3rdWeather}
            refresh
          >
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Wind Direction</h6>
                <p className="value">{thirdWeatherData.windDirection} deg</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Wind Speed</h6>
                <p className="value">{thirdWeatherData.windSpeed} m/s</p>
              </div>
            </div>
            <Progress color="primary" value={(thirdWeatherData.windSpeed / 60) * 100} className="bg-subtle-blue progress-xs" />
            <p>
              {thirdWeatherData.windSpeed - pastWindSpeed > 0 ? (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-up" />
                    </span>
                  </small>
                  Wind Speed<span className="fw-semi-bold">&nbsp;{thirdWeatherData.windSpeed - pastWindSpeed}m/s faster</span>
                  &nbsp;than yesterday
                </>
              ) : (
                <>
                  <small>
                    <span className="circle bg-default text-white mr-2">
                      <i className="fa fa-chevron-down" />
                    </span>
                  </small>
                  Wind Speed
                  <span className="fw-semi-bold">&nbsp;{Math.abs(thirdWeatherData.windSpeed - pastWindSpeed)}m/s slower</span>
                  &nbsp;than yesterday
                </>
              )}
            </p>
          </Widget>
        </Col>
      </Row>

      <Row>
        <Col lg={12} xs={12}>
          <Widget
            title={
              <h6>
                {" "}
                Logs{" "}
                <span style={{ fontSize: "10px", fontStyle: "italic" }}>
                  lasted updated: <Moment format="YYYY-MM-DD HH:mm">{logUpdateDate}</Moment>
                </span>
              </h6>
            }
            dataType="lastest-logs"
            refreshFun={getLogList}
            refresh
          >
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
              <FormGroup className="mt">
                <InputGroup className="input-group-no-border">
                  <Input
                    id="searchLogMsg"
                    className="input-transparent pl-3 form-control-sm"
                    value={searchLogMsg}
                    onChange={(e) => setSearchLogMsg(e.target.value)}
                    type="text"
                    placeholder="Search (log message)"
                  />
                  <Button color="inverse" className="social-button" size="xs" onClick={searchLog}>
                    <i className="fa fa-search"></i>
                  </Button>
                </InputGroup>
              </FormGroup>
            </footer>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
