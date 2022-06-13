import { CREATE_INBOX, RETRIEVE_INBOXS, RETRIEVE_INBOX, UPDATE_INBOX, DELETE_INBOX, DELETE_ALL_INBOXS } from "../actions/types";

const initialState = [];

function inboxReducer(inboxs = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // Inbox 생성
    case CREATE_INBOX:
      return [...inboxs, payload];

    // Inbox 전체 조회
    case RETRIEVE_INBOXS:
      return payload;

    // Inbox 조회
    case RETRIEVE_INBOX:
      return payload;

    // Inbox 수정
    case UPDATE_INBOX:
      let results = [];
      if (inboxs.length === undefined) {
        results.push(inboxs);
      } else {
        results = inboxs;
      }
      return results.map((inbox) => {
        if (inbox.id === payload.id) {
          return {
            ...inbox,
            ...payload,
          };
        } else {
          return inbox;
        }
      });

    // Inbox 삭제
    case DELETE_INBOX:
      return inboxs.filter(({ id }) => id !== payload.id);

    // Inbox 전체 삭제
    case DELETE_ALL_INBOXS:
      return [];

    default:
      return inboxs;
  }
}

export default inboxReducer;
