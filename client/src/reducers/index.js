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
import pays from "./pays";
import asserts from "./payasserts";
import cats from "./paycats";

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
  pays,
  asserts,
  cats,

  navigation,
  alerts,
});
