import { DISMISS_ALERT } from "../actions/alerts";

const defaultState = {
  alertsList: [
    {
      id: 0,
      title: "temperature",
      value: 16,
      color: "danger",
      footer: "2022-03-07 16:00 기준",
    },
    {
      id: 1,
      title: "humidity",
      value: 88,
      color: "warning",
      footer: "2022-03-07 16:00 기준",
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
