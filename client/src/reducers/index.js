import { combineReducers } from "redux";
import boards from "./boards";
import users from "./users";
import groups from "./groups";
import auth from "./auth";
import folder from "./folders";
import task from "./tasks";
import schedules from "./schedules";

import navigation from "./navigation";
import alerts from "./alerts";

export default combineReducers({
  boards,
  users,
  groups,
  auth,
  folder,
  task,
  schedules,

  navigation,
  alerts,
});
