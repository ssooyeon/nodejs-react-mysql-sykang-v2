import http from "../http-common";

class UserService {
  // 사용자 전체 조회
  getAll(params) {
    return http.get("/users", { params });
  }

  // 사용자 조회
  get(id) {
    return http.get(`/users/${id}`);
  }

  // 사용자 생성
  create(data) {
    return http.post("/users", data);
  }

  // 사용자 수정 시 현재 비밀번호 확인
  compareCurrentPassword(data) {
    return http.post("/users/compare/password", data);
  }

  // 사용자 수정
  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  // 사용자 삭제
  delete(id) {
    return http.delete(`/users/${id}`);
  }

  // 사용자 전체 삭제
  deleteAll() {
    return http.delete("/users");
  }

  // 사용자 계정으로 조회
  findByAccount(account) {
    return http.get(`/users/account/${account}`);
  }

  // 사용자 로그인
  getAuthLogin(data) {
    return http.post("/users/auth/login", data);
  }

  // 사용자 로그인
  getSocialLogin(data) {
    return http.post("/users/auth/social/login", data);
  }

  /************************************************************ 통계 */
  // 월별/일별 사용자 생성수 조회
  getAllCreationByChart(params) {
    return http.get("/users/statistic/creation", { params });
  }

  // 사용자 생성수 최고 5일 조회
  getTop5Creation() {
    return http.get("/users/statistic/creation/top5");
  }

  // 그룹 사용자 최대 5개 조회
  getTop5Group() {
    return http.get("/users/statistic/group/top5");
  }
}

export default new UserService();
