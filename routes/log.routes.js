module.exports = (app) => {
  const logs = require("../controllers/log.controller");
  var router = require("express").Router();

  router.post("/", logs.create);
  router.get("/", logs.findAll);
  router.get("/statistic", logs.findAllByChart);
  router.get("/message/:message", logs.findAllByMessage);
  router.get("/:id", logs.findOne);

  app.use("/api/logs", router);
};
