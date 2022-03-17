import http from "../http-common";

class LogService {
  // 로그 전체 조회
  getAll() {
    return http.get("/logs");
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

  /************************************************************ 통계 */
  // 월별/일별 로그 조회
  getAllByChart(params) {
    return http.get("/logs/statistic/creation", { params });
  }

  // 월별/일별 사용자 로그인 수 조회
  getAllLoginByChart(params) {
    return http.get("/logs/statistic/login", { params });
  }

  // 사용자 로그인수 최고 5일 조회
  getTop5Login() {
    return http.get("/logs/statistic/login/top5");
  }
}

export default new LogService();
