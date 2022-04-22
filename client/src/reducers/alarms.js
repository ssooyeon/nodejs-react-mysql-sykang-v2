import { CREATE_ALARM, RETRIEVE_ALARMS, RETRIEVE_ALARM, RETRIEVE_ALARMS_BY_USER, UPDATE_ALARM } from "../actions/types";

const initialState = [];

function alarmReducer(alarms = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // 알람 생성
    case CREATE_ALARM:
      return [...alarms, payload];
    // 알람 전체 조회
    case RETRIEVE_ALARMS:
      return payload;

    // 알람 조회
    case RETRIEVE_ALARM:
      return payload;

    // 알람 사용자별 조회
    case RETRIEVE_ALARMS_BY_USER:
      console.log(payload);
      return payload;

    // 알람 수정
    case UPDATE_ALARM:
      let results = [];
      if (alarms.length === undefined) {
        results.push(alarms);
      } else {
        results = alarms;
      }
      return results.map((alarm) => {
        if (alarm.id === payload.id) {
          return {
            ...alarm,
            ...payload,
          };
        } else {
          return alarm;
        }
      });

    default:
      return alarms;
  }
}

export default alarmReducer;
