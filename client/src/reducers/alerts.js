import { DISMISS_ALERT } from "../actions/alerts";

const defaultState = {
  alertsList: [
    {
      id: 0,
      title: "alert#1",
      value: 16,
      color: "primary",
      footer: "alert message#1",
    },
    {
      id: 1,
      title: "alert#2",
      value: 88,
      color: "danger",
      footer: "alert message#2",
    },
  ],
};

export default function alertsReducer(state = defaultState, action) {
  let index;
  switch (action.type) {
    case DISMISS_ALERT:
      state.alertsList.forEach((alert, alertIndex) => {
        if (alert.id === action.id) {
          index = alertIndex;
        }
      });
      return Object.assign({}, state, {
        alertsList: [...state.alertsList.slice(0, index), ...state.alertsList.slice(index + 1)],
      });
    default:
      return state;
  }
}
