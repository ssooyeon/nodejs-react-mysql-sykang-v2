import http from "../http-common";

class WeatherService {
  // 현재 날씨 정보 조회
  getAllCurrent(params) {
    return http.get("/weather/current", { params });
  }

  // 어제 온도, 습도, 풍속 조회
  getAllPast(params) {
    return http.get("/weather/past", { params });
  }
}

export default new WeatherService();
