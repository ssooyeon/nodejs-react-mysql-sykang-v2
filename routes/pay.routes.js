module.exports = (app) => {
  const pays = require("../controllers/pay.controller");
  var router = require("express").Router();

  router.post("/", pays.create);
  router.get("/", pays.findAll);
  router.get("/:id", pays.findOne);
  router.put("/:id", pays.update);
  router.delete("/:id", pays.delete);
  router.delete("/", pays.deleteAll);
  /************************************************************ 통계 */
  router.get("/today/amount", pays.todayAmount);
  router.get("/month/amount", pays.monthAmount);
  router.get("/month/cat", pays.findSpendingByCat);

  app.use("/api/pays", router);
};
