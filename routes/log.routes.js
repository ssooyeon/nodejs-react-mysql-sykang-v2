module.exports = (app) => {
  const logs = require("../controllers/log.controller");
  var router = require("express").Router();

  router.post("/", logs.create);
  router.get("/", logs.findAll);
  router.get("/message/:message", logs.findAllByMessage);
  router.get("/:id", logs.findOne);

  /************************************************************ 통계 */
  router.get("/statistic/creation", logs.findAllByChart);
  router.get("/statistic/login", logs.findAllLoginByChart);
  router.get("/statistic/login/top5", logs.findTop5Login);

  app.use("/api/logs", router);
};
