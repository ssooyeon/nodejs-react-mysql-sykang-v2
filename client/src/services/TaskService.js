import http from "../http-common";

class TaskService {
  // 테스크 전체 조회
  getAll(params) {
    return http.get("/tasks", { params });
  }

  // 테스크 조회
  get(id) {
    return http.get(`/tasks/${id}`);
  }

  // 현재 로그인한 사용자의 테스크 전체 조회
  getAllByUser(userId) {
    return http.get(`/tasks/user/${userId}`);
  }

  // 테스크 생성
  create(data) {
    return http.post("/tasks", data);
  }

  // 테스크 수정
  update(id, data) {
    return http.put(`/tasks/${id}`, data);
  }

  // 테스크 삭제
  delete(id) {
    return http.delete(`/tasks/${id}`);
  }

  // 테스크 전체 삭제
  deleteAll() {
    return http.delete("/tasks");
  }

  /************************************************************ 통계 */
  // 월별/일별 테스크 만료일 수 조회
  getAllDueDateByChart(params) {
    return http.get("/tasks/statistic/duedate", { params });
  }

  // 테스크 due date 개수 최고 5일 조회
  getTop5DueDate() {
    return http.get("/tasks/statistic/duedate/top5");
  }

  // 폴더별 테스크 수 조회
  getAllFolderByChart() {
    return http.get("/tasks/statistic/folder");
  }

  // 폴더별, 사용자별 테스크 수 조회
  getAllUserFolderByChart() {
    return http.get("/tasks/statistic/folder/user");
  }

  // 테스크 개수 최고 사용자 조회
  getTop5TaskUser() {
    return http.get("/tasks/statistic/user/top5");
  }
}

export default new TaskService();
