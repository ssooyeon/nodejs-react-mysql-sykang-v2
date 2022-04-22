module.exports = (app) => {
  const alarms = require("../controllers/alarm.controller");
  var router = require("express").Router();

  router.post("/", alarms.create);
  router.post("/member", alarms.createWithGroupMembers);
  router.get("/user/:userId", alarms.findAllByUser);
  router.get("/", alarms.findAll);
  router.get("/:id", alarms.findOne);
  router.put("/:id", alarms.update);

  app.use("/api/alarms", router);
};
