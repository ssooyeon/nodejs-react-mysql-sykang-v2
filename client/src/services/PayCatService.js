import http from "../http-common";

class CatService {
  // cat 전체 조회
  getAll(params) {
    return http.get("/cats", { params });
  }

  // cat 조회
  get(id) {
    return http.get(`/cats/${id}`);
  }

  // cat 생성
  create(data) {
    return http.post("/cats", data);
  }

  // cat 수정
  update(id, data) {
    return http.put(`/cats/${id}`, data);
  }

  // cat 삭제
  delete(id) {
    return http.delete(`/cats/${id}`);
  }

  // cat 전체 삭제
  deleteAll() {
    return http.delete("/cats");
  }
}

export default new CatService();
