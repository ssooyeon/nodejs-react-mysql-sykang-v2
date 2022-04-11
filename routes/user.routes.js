module.exports = (app) => {
  const users = require("../controllers/user.controller");
  var router = require("express").Router();

  router.post("/", users.create);
  router.get("/", users.findAll);
  router.get("/:id", users.findOne);
  router.get("/account/:account", users.findByAccount);
  router.post("/compare/password", users.compareCurrentPassword);
  router.put("/:id", users.update);
  router.delete("/:id", users.delete);
  router.delete("/", users.deleteAll);
  router.post("/auth/login", users.authLogin);
  router.post("/auth/social/login", users.socialLogin);

  /************************************************************ 통계 */
  router.get("/statistic/creation", users.findAllCreationByChart);
  router.get("/statistic/creation/top5", users.findTop5Creation);
  router.get("/statistic/group/top5", users.findTop5Group);

  app.use("/api/users", router);
};
