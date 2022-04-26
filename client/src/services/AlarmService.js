import http from "../http-common";

class AlarmService {
  // 알람 전체 조회
  getAll() {
    return http.get("/alarms");
  }

  // 알람 조회
  get(id) {
    return http.get(`/alarms/${id}`);
  }

  // 사용자 별 알람 조회
  getAllByUser(userId) {
    return http.get(`/alarms/user/${userId}`);
  }

  // 알람 생성
  create(data) {
    return http.post("/alarms", data);
  }

  // 그룹의 멤버 조회 후 알람 추가
  createWithGroupMembers(data) {
    return http.post("/alarms/member", data);
  }

  // 알람 수정 (notify)
  update(id, data) {
    return http.put(`/alarms/${id}`, data);
  }

  // 알람 전체 수정 (notify)
  updateAll(userId, data) {
    return http.put(`/alarms/user/${userId}`, data);
  }
}

export default new AlarmService();
