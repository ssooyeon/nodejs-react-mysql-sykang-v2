import { CREATE_PAY, RETRIEVE_PAYS, RETRIEVE_PAY, UPDATE_PAY, DELETE_PAY, DELETE_ALL_PAYS } from "../actions/types";

const initialState = [];

function payReducer(pays = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // payment 생성
    case CREATE_PAY:
      return [...pays, payload];

    // payment 전체 조회
    case RETRIEVE_PAYS:
      return payload;

    // payment 조회
    case RETRIEVE_PAY:
      return payload;

    // payment 수정
    case UPDATE_PAY:
      // edit 페이지에서 새로고침하고 업데이트하면 pays가 list인데 한 번 더 업데이트하면 그냥 object가 됨
      let results = [];
      if (pays.length === undefined) {
        results.push(pays);
      } else {
        results = pays;
      }
      return results.map((pay) => {
        if (pay.id === payload.id) {
          return {
            ...pay,
            ...payload,
          };
        } else {
          return pay;
        }
      });

    // payment 삭제
    case DELETE_PAY:
      return pays.filter(({ id }) => id !== payload.id);

    // payment 전체 삭제
    case DELETE_ALL_PAYS:
      return [];

    default:
      return pays;
  }
}

export default payReducer;
