import http from "../http-common";

class AssertService {
  // assert 전체 조회
  getAll(params) {
    return http.get("/asserts", { params });
  }

  // assert 조회
  get(id) {
    return http.get(`/asserts/${id}`);
  }

  // assert 생성
  create(data) {
    return http.post("/asserts", data);
  }

  // assert 수정
  update(id, data) {
    return http.put(`/asserts/${id}`, data);
  }

  // assert 삭제
  delete(id) {
    return http.delete(`/asserts/${id}`);
  }

  // assert 전체 삭제
  deleteAll() {
    return http.delete("/asserts");
  }
}

export default new AssertService();
