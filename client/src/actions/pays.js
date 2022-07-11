import { CREATE_PAY, RETRIEVE_PAYS, RETRIEVE_PAY, UPDATE_PAY, DELETE_PAY, DELETE_ALL_PAYS } from "./types";

import PayService from "../services/PayService";

/**
 * payment 생성
 */
export const createPay = (data) => async (dispatch) => {
  try {
    const res = await PayService.create(data);

    dispatch({
      type: CREATE_PAY,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * payment 전체 조회
 */
export const retrievePays = (params) => async (dispatch) => {
  try {
    const res = await PayService.getAll(params);
    dispatch({
      type: RETRIEVE_PAYS,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * payment 상세보기
 */
export const retrievePay = (id) => async (dispatch) => {
  try {
    const res = await PayService.get(id);
    dispatch({
      type: RETRIEVE_PAY,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * payment 수정
 */
export const updatePay = (id, data) => async (dispatch) => {
  try {
    const res = await PayService.update(id, data);
    dispatch({
      type: UPDATE_PAY,
      payload: data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * payment 삭제
 */
export const deletePay = (id) => async (dispatch) => {
  try {
    await PayService.delete(id);

    dispatch({
      type: DELETE_PAY,
      payload: { id },
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * payment 전체 삭제
 */
export const deleteAllPays = () => async (dispatch) => {
  try {
    const res = await PayService.deleteAll();

    dispatch({
      type: DELETE_ALL_PAYS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
