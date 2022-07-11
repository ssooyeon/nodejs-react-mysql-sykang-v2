import { CREATE_CAT, RETRIEVE_CATS, RETRIEVE_CAT, UPDATE_CAT, DELETE_CAT, DELETE_ALL_CATS } from "../actions/types";

const initialState = [];

function catReducer(cats = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // cat 생성
    case CREATE_CAT:
      return [...cats, payload];

    // cat 전체 조회
    case RETRIEVE_CATS:
      return payload;

    // cat 조회
    case RETRIEVE_CAT:
      return payload;

    // cat 수정
    case UPDATE_CAT:
      // edit 페이지에서 새로고침하고 업데이트하면 cats가 list인데 한 번 더 업데이트하면 그냥 object가 됨
      let results = [];
      if (cats.length === undefined) {
        results.push(cats);
      } else {
        results = cats;
      }
      return results.map((cat) => {
        if (cat.id === payload.id) {
          return {
            ...cat,
            ...payload,
          };
        } else {
          return cat;
        }
      });

    // cat 삭제
    case DELETE_CAT:
      return cats.filter(({ id }) => id !== payload.id);

    // cat 전체 삭제
    case DELETE_ALL_CATS:
      return [];

    default:
      return cats;
  }
}

export default catReducer;
