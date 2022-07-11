import { CREATE_ASSERT, RETRIEVE_ASSERTS, RETRIEVE_ASSERT, UPDATE_ASSERT, DELETE_ASSERT, DELETE_ALL_ASSERTS } from "../actions/types";

const initialState = [];

function assertReducer(asserts = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // assert 생성
    case CREATE_ASSERT:
      return [...asserts, payload];

    // assert 전체 조회
    case RETRIEVE_ASSERTS:
      return payload;

    // assert 조회
    case RETRIEVE_ASSERT:
      return payload;

    // assert 수정
    case UPDATE_ASSERT:
      // edit 페이지에서 새로고침하고 업데이트하면 asserts가 list인데 한 번 더 업데이트하면 그냥 object가 됨
      let results = [];
      if (asserts.length === undefined) {
        results.push(asserts);
      } else {
        results = asserts;
      }
      return results.map((assert) => {
        if (assert.id === payload.id) {
          return {
            ...assert,
            ...payload,
          };
        } else {
          return assert;
        }
      });

    // assert 삭제
    case DELETE_ASSERT:
      return asserts.filter(({ id }) => id !== payload.id);

    // assert 전체 삭제
    case DELETE_ALL_ASSERTS:
      return [];

    default:
      return asserts;
  }
}

export default assertReducer;
