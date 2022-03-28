import axios from "axios";
import dateTime from "date-and-time";

const BASE_API_URL = `weather/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_WEATHER_API_KEY}&numOfRows=100&pageNo=1`;

class WeatherService {
  getWeathers(type) {
    // get current date (-1hour)
    let now = new Date();
    const hourAgo = now.setHours(now.getHours() - 1);
    let fmt = dateTime.format(new Date(hourAgo), "YYYYMMDD HHmm");
    let arr = fmt.split(" ");

    let base_date = arr[0];
    let base_time = arr[1];

    const CURRENT_API_URL = BASE_API_URL + `&base_date=${base_date}&base_time=${base_time}&nx=67&ny=101&dataType=JSON`;

    return axios
      .get(CURRENT_API_URL)
      .then((data) => {
        if (data.data.response.body !== undefined) {
          const currentData = data.data.response.body.items;
          const firstData = currentData.item[0];

          switch (type) {
            case "first":
              const SKY = currentData.item.filter((x) => x.category === "SKY")[0];
              const T1H = currentData.item.filter((x) => x.category === "T1H")[0];

              return {
                baseDate: firstData.baseDate, // 발표일자
                baseTime: firstData.baseTime, // 발표시간
                fcstDate: firstData.fcstDate, // 예측일자
                fcstTime: firstData.fcstTime, // 예측시간
                sky: SKY.fcstValue, // 하늘상태: 1-맑음, 3-구름많음, 4-흐림
                t1h: T1H.fcstValue, // 기온: C
              };

            case "second":
              const PTY = currentData.item.filter((x) => x.category === "PTY")[0];
              const RN1 = currentData.item.filter((x) => x.category === "RN1")[0];
              const REH = currentData.item.filter((x) => x.category === "REH")[0];

              return {
                baseDate: firstData.baseDate, // 발표일자
                baseTime: firstData.baseTime, // 발표시간
                fcstDate: firstData.fcstDate, // 예측일자
                fcstTime: firstData.fcstTime, // 예측시간
                pty: PTY.fcstValue, // 강수형태: 0-없음, 1-비, 2-비/눈, 3-눈, 4-소나기
                rn1: RN1.fcstValue, // 1시간 강수량: mm
                reh: REH.fcstValue, // 습도: %
              };

            case "third":
              const VEC = currentData.item.filter((x) => x.category === "VEC")[0];
              const WSD = currentData.item.filter((x) => x.category === "WSD")[0];

              return {
                baseDate: firstData.baseDate, // 발표일자
                baseTime: firstData.baseTime, // 발표시간
                fcstDate: firstData.fcstDate, // 예측일자
                fcstTime: firstData.fcstTime, // 예측시간
                vec: VEC.fcstValue, // 풍향: deg
                wsd: WSD.fcstValue, // 풍속: m/s
              };

            default:
              return null;
          }
        } else {
          return null;
        }
      })
      .catch((e) => {
        return null;
      });
  }

  // 어제 온도, 습도, 풍속 조회
  getPastWeather(type) {
    // get past date (-1day, +1hour)
    let now = new Date();
    let dayAgo = new Date(now.setDate(now.getDate() - 1));
    const addHour = dayAgo.setHours(dayAgo.getHours() + 1);
    const fmt = dateTime.format(new Date(addHour), "YYYYMMDD HHmm");
    const arr = fmt.split(" ");

    const base_date = arr[0];
    const base_time = arr[1];

    const PAST_API_URL = BASE_API_URL + `&base_date=${base_date}&base_time=${base_time}&nx=67&ny=101&dataType=JSON`;

    return axios
      .get(PAST_API_URL)
      .then((data) => {
        if (data.data.response.body !== undefined) {
          const pastData = data.data.response.body.items;

          switch (type) {
            case "temp":
              const T1H = pastData.item.filter((x) => x.category === "T1H")[0];
              return T1H.fcstValue;
            case "humidity":
              const REH = pastData.item.filter((x) => x.category === "REH")[0];
              return REH.fcstValue;
            case "wind":
              const WSD = pastData.item.filter((x) => x.category === "WSD")[0];
              return WSD.fcstValue;
            default:
              return null;
          }
        } else {
          return null;
        }
      })
      .catch((e) => {
        return null;
      });
  }
}

export default new WeatherService();
