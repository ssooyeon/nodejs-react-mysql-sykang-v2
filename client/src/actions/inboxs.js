import { CREATE_INBOX, RETRIEVE_INBOXS, RETRIEVE_INBOX, UPDATE_INBOX, DELETE_INBOX, DELETE_ALL_INBOXS } from "./types";

import InboxService from "../services/InboxService";

/**
 * Inbox 생성
 */
export const createInbox = (data) => async (dispatch) => {
  try {
    const res = await InboxService.create(data);

    dispatch({
      type: CREATE_INBOX,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * Inbox 전체 조회
 */
export const retrieveInboxs = (params) => async (dispatch) => {
  try {
    const res = await InboxService.getAll(params);
    dispatch({
      type: RETRIEVE_INBOXS,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * Inbox 상세보기
 */
export const retrieveInbox = (id) => async (dispatch) => {
  try {
    const res = await InboxService.get(id);
    dispatch({
      type: RETRIEVE_INBOX,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * Inbox 수정
 */
export const updateInbox = (id, data) => async (dispatch) => {
  try {
    const res = await InboxService.update(id, data);
    dispatch({
      type: UPDATE_INBOX,
      payload: data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * Inbox 삭제
 */
export const deleteInbox = (id) => async (dispatch) => {
  try {
    await InboxService.delete(id);

    dispatch({
      type: DELETE_INBOX,
      payload: { id },
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Inbox 전체 삭제
 */
export const deleteAllInboxs = () => async (dispatch) => {
  try {
    const res = await InboxService.deleteAll();

    dispatch({
      type: DELETE_ALL_INBOXS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
