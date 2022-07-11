import { CREATE_CAT, RETRIEVE_CATS, RETRIEVE_CAT, UPDATE_CAT, DELETE_CAT, DELETE_ALL_CATS } from "./types";

import CatService from "../services/PayCatService";

/**
 * cat 생성
 */
export const createCat = (data) => async (dispatch) => {
  try {
    const res = await CatService.create(data);

    dispatch({
      type: CREATE_CAT,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * cat 전체 조회
 */
export const retrieveCats = (params) => async (dispatch) => {
  try {
    const res = await CatService.getAll(params);
    dispatch({
      type: RETRIEVE_CATS,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * cat 상세보기
 */
export const retrieveCat = (id) => async (dispatch) => {
  try {
    const res = await CatService.get(id);
    dispatch({
      type: RETRIEVE_CAT,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * cat 수정
 */
export const updateCat = (id, data) => async (dispatch) => {
  try {
    const res = await CatService.update(id, data);
    dispatch({
      type: UPDATE_CAT,
      payload: data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * cat 삭제
 */
export const deleteCat = (id) => async (dispatch) => {
  try {
    await CatService.delete(id);

    dispatch({
      type: DELETE_CAT,
      payload: { id },
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * cat 전체 삭제
 */
export const deleteAllCats = () => async (dispatch) => {
  try {
    const res = await CatService.deleteAll();

    dispatch({
      type: DELETE_ALL_CATS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
