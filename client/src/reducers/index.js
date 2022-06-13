import { combineReducers } from "redux";
import boards from "./boards";
import users from "./users";
import groups from "./groups";
import auth from "./auth";
import folder from "./folders";
import tasks from "./tasks";
import schedules from "./schedules";
import alarms from "./alarms";
import inboxs from "./inboxs";

import navigation from "./navigation";
import alerts from "./alerts";

export default combineReducers({
  boards,
  users,
  groups,
  auth,
  folder,
  tasks,
  schedules,
  alarms,
  inboxs,

  navigation,
  alerts,
});
