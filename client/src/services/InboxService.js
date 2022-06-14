import http from "../http-common";

class InboxService {
  // Inbox 전체 조회
  getAll(params) {
    return http.get("/inboxs", { params });
  }

  // Inbox folder 별 count 조회
  getCount(params) {
    return http.get("/inboxs/count/user", { params });
  }

  // Inbox 조회
  get(id) {
    return http.get(`/inboxs/${id}`);
  }

  // Inbox 생성
  create(data) {
    return http.post("/inboxs", data);
  }

  // Inbox 수정
  update(id, data) {
    return http.put(`/inboxs/${id}`, data);
  }

  // Inbox 삭제
  delete(id) {
    return http.delete(`/inboxs/${id}`);
  }

  // Inbox 전체 삭제
  deleteAll() {
    return http.delete("/inboxs");
  }

  // Folder 별 Inbox 전체 삭제
  deleteAllInFolder(params) {
    return http.delete("/inboxs/folder", { params });
  }
}

export default new InboxService();
