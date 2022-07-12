import http from "../http-common";

class PayService {
  // payment 전체 조회
  getAll(params) {
    return http.get("/pays", { params });
  }

  // payment 조회
  get(id) {
    return http.get(`/pays/${id}`);
  }

  // payment 생성
  create(data) {
    return http.post("/pays", data);
  }

  // payment 수정
  update(id, data) {
    return http.put(`/pays/${id}`, data);
  }

  // payment 삭제
  delete(id) {
    return http.delete(`/pays/${id}`);
  }

  // payment 전체 삭제
  deleteAll() {
    return http.delete("/pays");
  }

  /************************************************************ 통계 */
  // today amount 조회
  getTodayAmount(params) {
    return http.get("/pays/today/amount", { params });
  }

  // this month amount 조회
  getMonthAmount(params) {
    return http.get("/pays/month/amount", { params });
  }

  // this month cat count 조회
  getSpendingByCat(params) {
    return http.get("/pays/month/cat", { params });
  }
}

export default new PayService();
