import axios from "axios";
import dateTime from "date-and-time";

class WeatherService {
  getWeathers() {
    let now = new Date();
    const hourAgo = now.setHours(now.getHours() - 1);
    const fmt = dateTime.format(new Date(hourAgo), "YYYYMMDD HHmm");
    const arr = fmt.split(" ");

    const base_date = arr[0];
    const base_time = arr[1];

    const API_URL = `weather/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_WEATHER_API_KEY}&numOfRows=100&pageNo=1&base_date=${base_date}&base_time=${base_time}&nx=67&ny=101&dataType=JSON`;

    return axios.get(API_URL).then((data) => {
      if (data.data.response.body !== undefined) {
        const apiData = data.data.response.body.items;
        const firstData = apiData.item[0];

        const PTY = apiData.item.filter((x) => x.category === "PTY")[0];
        const RN1 = apiData.item.filter((x) => x.category === "RN1")[0];
        const SKY = apiData.item.filter((x) => x.category === "SKY")[0];
        const T1H = apiData.item.filter((x) => x.category === "T1H")[0];
        const REH = apiData.item.filter((x) => x.category === "REH")[0];
        const VEC = apiData.item.filter((x) => x.category === "VEC")[0];
        const WSD = apiData.item.filter((x) => x.category === "WSD")[0];

        const result = {
          baseDate: firstData.baseDate, // 발표일자
          baseTime: firstData.baseTime, // 발표시간
          fcstDate: firstData.fcstDate, // 예측일자
          fcstTime: firstData.fcstTime, // 예측시간
          pty: PTY.fcstValue, // 강수형태: 0-없음, 1-비, 2-비/눈, 3-눈, 4-소나기
          rn1: RN1.fcstValue, // 1시간 강수량: mm
          sky: SKY.fcstValue, // 하늘상태: 1-맑음, 3-구름많음, 4-흐림
          t1h: T1H.fcstValue, // 기온: C
          reh: REH.fcstValue, // 습도: %
          vec: VEC.fcstValue, // 풍향: deg
          wsd: WSD.fcstValue, // 풍속: m/s
        };
        return result;
      } else {
        return null;
      }
    });
  }

  getPastWeathers() {
    let now = new Date();
    let dayAgo = new Date(now.setDate(now.getDate() - 1));
    const addHour = dayAgo.setHours(dayAgo.getHours() + 1);
    const fmt = dateTime.format(new Date(addHour), "YYYYMMDD HHmm");
    const arr = fmt.split(" ");

    const base_date = arr[0];
    const base_time = arr[1];

    const API_URL = `weather/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_WEATHER_API_KEY}&numOfRows=100&pageNo=1&base_date=${base_date}&base_time=${base_time}&nx=67&ny=101&dataType=JSON`;

    return axios.get(API_URL).then((data) => {
      if (data.data.response.body !== undefined) {
        const apiData = data.data.response.body.items;

        const T1H = apiData.item.filter((x) => x.category === "T1H")[0];
        const REH = apiData.item.filter((x) => x.category === "REH")[0];
        const WSD = apiData.item.filter((x) => x.category === "WSD")[0];

        const result = {
          t1h: T1H.fcstValue, // 기온: C
          reh: REH.fcstValue, // 습도: %
          wsd: WSD.fcstValue, // 풍속: m/s
        };
        return result;
      } else {
        return null;
      }
    });
  }
}

export default new WeatherService();
