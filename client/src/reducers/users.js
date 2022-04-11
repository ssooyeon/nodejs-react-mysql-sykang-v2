import {
  CREATE_USER,
  CREATE_SOCIAL_USER,
  RETRIEVE_USERS,
  RETRIEVE_USER,
  RETRIEVE_FOR_CREATE_SOCIAL,
  RETRIEVE_BY_ACCOUNT,
  COMPARE_CURRENT_PASSWORD,
  UPDATE_USER,
  DELETE_USER,
  DELETE_ALL_USERS,
} from "../actions/types";

const initialState = [];

function userReducer(users = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // 사용자 생성
    case CREATE_USER:
      return [...users, payload];

    // social 사용자 생성
    case CREATE_SOCIAL_USER:
      return [...users, payload];

    // 사용자 전체 조회
    case RETRIEVE_USERS:
      return payload;

    // 사용자 조회
    case RETRIEVE_USER:
      return payload;

    // social 사용자 생성 전 중복 조회
    case RETRIEVE_FOR_CREATE_SOCIAL:
      return payload;

    // 사용자 계정으로 조회
    case RETRIEVE_BY_ACCOUNT:
      return payload;

    // 사용자 수정 시 현재 비밀번호 확인
    case COMPARE_CURRENT_PASSWORD:
      return payload;

    // 사용자 수정
    case UPDATE_USER:
      let results = [];
      if (users.length === undefined) {
        results.push(users);
      } else {
        results = users;
      }
      return results.map((user) => {
        if (user.id === payload.id) {
          return {
            ...user,
            ...payload,
          };
        } else {
          return user;
        }
      });

    // 사용자 삭제
    case DELETE_USER:
      return users.filter(({ id }) => id !== payload.id);

    // 사용자 전체 삭제
    case DELETE_ALL_USERS:
      return [];

    default:
      return users;
  }
}

export default userReducer;
