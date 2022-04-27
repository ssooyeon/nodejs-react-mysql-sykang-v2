import {
  CREATE_ALARM,
  CREATE_ALARM_WITH_GROUP,
  RETRIEVE_ALARMS,
  RETRIEVE_ALARM,
  RETRIEVE_ALARMS_BY_USER,
  UPDATE_ALARM,
  UPDATE_ALL_ALARM,
} from "./types";

import AlarmService from "../services/AlarmService";

/**
 * 알람 생성
 */
export const createAlarm = (data) => async (dispatch) => {
  try {
    const res = await AlarmService.create(data);

    dispatch({
      type: CREATE_ALARM,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 그룹 조회 후 알람 생성
 */
export const createAlarmWithGroup = (data) => async (dispatch) => {
  try {
    const res = await AlarmService.createWithGroupMembers(data);

    dispatch({
      type: CREATE_ALARM_WITH_GROUP,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 알람 전체 조회
 */
export const retrieveAlarms = (params) => async (dispatch) => {
  try {
    const res = await AlarmService.getAll(params);
    dispatch({
      type: RETRIEVE_ALARMS,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 알람 조회
 */
export const retrieveAlarm = (id) => async (dispatch) => {
  try {
    const res = await AlarmService.get(id);
    dispatch({
      type: RETRIEVE_ALARM,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 알람 사용자 별 조회
 */
export const retrieveAlarmByUser = (userId) => async (dispatch) => {
  try {
    const res = await AlarmService.getAllByUser(userId);
    dispatch({
      type: RETRIEVE_ALARMS_BY_USER,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 알람 수정
 */
export const updateAlarm = (id, data) => async (dispatch) => {
  try {
    const res = await AlarmService.update(id, data);
    dispatch({
      type: UPDATE_ALARM,
      payload: data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 사용자 별 알람 전체 수정
 */
export const updateAllAlarm = (userId, data) => async (dispatch) => {
  try {
    const res = await AlarmService.updateAll(userId, data);
    dispatch({
      type: UPDATE_ALL_ALARM,
      payload: data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
