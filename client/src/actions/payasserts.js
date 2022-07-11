import { CREATE_ASSERT, RETRIEVE_ASSERTS, RETRIEVE_ASSERT, UPDATE_ASSERT, DELETE_ASSERT, DELETE_ALL_ASSERTS } from "./types";

import AssertService from "../services/PayAssertService";

/**
 * assert 생성
 */
export const createAssert = (data) => async (dispatch) => {
  try {
    const res = await AssertService.create(data);

    dispatch({
      type: CREATE_ASSERT,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * assert 전체 조회
 */
export const retrieveAsserts = (params) => async (dispatch) => {
  try {
    const res = await AssertService.getAll(params);
    dispatch({
      type: RETRIEVE_ASSERTS,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * assert 상세보기
 */
export const retrieveAssert = (id) => async (dispatch) => {
  try {
    const res = await AssertService.get(id);
    dispatch({
      type: RETRIEVE_ASSERT,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * assert 수정
 */
export const updateAssert = (id, data) => async (dispatch) => {
  try {
    const res = await AssertService.update(id, data);
    dispatch({
      type: UPDATE_ASSERT,
      payload: data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * assert 삭제
 */
export const deleteAssert = (id) => async (dispatch) => {
  try {
    await AssertService.delete(id);

    dispatch({
      type: DELETE_ASSERT,
      payload: { id },
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * assert 전체 삭제
 */
export const deleteAllAsserts = () => async (dispatch) => {
  try {
    const res = await AssertService.deleteAll();

    dispatch({
      type: DELETE_ALL_ASSERTS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
