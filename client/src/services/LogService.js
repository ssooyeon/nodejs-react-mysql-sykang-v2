import http from "../http-common";

class LogService {
  // 로그 전체 조회
  getAll() {
    return http.get("/logs");
  }

  // 월별/일별 로그 조회
  getAllByChart(params) {
    return http.get("/logs/statistic", { params });
  }

  // 로그 조회
  get(id) {
    return http.get(`/logs/${id}`);
  }

  // 로그 내용 조회
  findByMessage(message) {
    return http.get(`/logs/message/${message}`);
  }

  // 로그 생성
  create(data) {
    return http.post("/logs", data);
  }
}

export default new LogService();
